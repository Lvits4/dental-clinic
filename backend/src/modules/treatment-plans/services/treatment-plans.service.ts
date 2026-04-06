import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { TreatmentPlan } from '../entities/treatment-plan.entity';
import { TreatmentPlanItem } from '../entities/treatment-plan-item.entity';
import { PerformedProcedure } from '../../performed-procedures/entities/performed-procedure.entity';
import { CreateTreatmentPlanDto } from '../dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from '../dto/update-treatment-plan.dto';
import { CreatePlanItemDto } from '../dto/create-plan-item.dto';
import { UpdatePlanItemDto } from '../dto/update-plan-item.dto';
import {
  FilterTreatmentPlanDto,
  TreatmentPlanSortBy,
  TreatmentPlanSortOrder,
} from '../dto/filter-treatment-plan.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class TreatmentPlansService {
  constructor(
    @InjectRepository(TreatmentPlan)
    private readonly planRepository: Repository<TreatmentPlan>,
    @InjectRepository(TreatmentPlanItem)
    private readonly itemRepository: Repository<TreatmentPlanItem>,
    @InjectRepository(PerformedProcedure)
    private readonly performedProcedureRepository: Repository<PerformedProcedure>,
  ) {}

  async create(createDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    const { items, ...planData } = createDto;
    const plan = this.planRepository.create(planData);
    const savedPlan = await this.planRepository.save(plan);

    if (items?.length) {
      const planItems = items.map((item) =>
        this.itemRepository.create({ ...item, treatmentPlanId: savedPlan.id }),
      );
      await this.itemRepository.save(planItems);
    }

    return this.findOne(savedPlan.id);
  }

  private applyPlanListFilters(
    qb: SelectQueryBuilder<TreatmentPlan>,
    patientId?: string,
    status?: string,
    search?: string,
  ): void {
    if (patientId) {
      qb.andWhere('plan.patient_id = :patientId', { patientId });
    }
    if (status) {
      qb.andWhere('plan.status = :status', { status });
    }
    if (search) {
      const q = `%${search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(patient.first_name) LIKE :q OR LOWER(patient.last_name) LIKE :q OR LOWER(COALESCE(plan.observations, \'\')) LIKE :q)',
        { q },
      );
    }
  }

  async findAll(
    filterDto: FilterTreatmentPlanDto,
  ): Promise<PaginatedResponseDto<TreatmentPlan>> {
    const {
      page = 1,
      limit = 10,
      patientId,
      status,
      search,
      sortBy = TreatmentPlanSortBy.CREATED_AT,
      sortOrder = TreatmentPlanSortOrder.DESC,
    } = filterDto;

    const dir = sortOrder === TreatmentPlanSortOrder.DESC ? 'DESC' : 'ASC';

    const countQb = this.planRepository
      .createQueryBuilder('plan')
      .leftJoin('plan.patient', 'patient')
      .leftJoin('plan.doctor', 'doctor');
    this.applyPlanListFilters(countQb, patientId, status, search);
    const totalItems = await countQb.getCount();

    let pagePlanIds: string[];

    if (sortBy === TreatmentPlanSortBy.ITEMS) {
      const idQb = this.planRepository
        .createQueryBuilder('plan')
        .select('plan.id', 'id')
        .leftJoin('plan.patient', 'patient')
        .leftJoin('plan.doctor', 'doctor');
      this.applyPlanListFilters(idQb, patientId, status, search);
      idQb
        .orderBy(
          '(SELECT COUNT(*)::int FROM treatment_plan_items i WHERE i.treatment_plan_id = plan.id)',
          dir,
        )
        .addOrderBy('plan.id', 'ASC')
        .offset((page - 1) * limit)
        .limit(limit);
      const raw = await idQb.getRawMany<Record<string, string>>();
      pagePlanIds = raw.map((row) => row.id ?? row.plan_id);
    } else {
      const qb = this.planRepository
        .createQueryBuilder('plan')
        .leftJoinAndSelect('plan.patient', 'patient')
        .leftJoinAndSelect('plan.doctor', 'doctor');
      this.applyPlanListFilters(qb, patientId, status, search);

      switch (sortBy) {
        case TreatmentPlanSortBy.PATIENT:
          qb.orderBy('patient.lastName', dir).addOrderBy('patient.firstName', dir);
          break;
        case TreatmentPlanSortBy.DOCTOR:
          qb.orderBy('doctor.lastName', dir).addOrderBy('doctor.firstName', dir);
          break;
        case TreatmentPlanSortBy.STATUS:
          qb.orderBy('plan.status', dir);
          break;
        case TreatmentPlanSortBy.CREATED_AT:
        default:
          qb.orderBy('plan.createdAt', dir);
      }

      qb.skip((page - 1) * limit).take(limit);
      const pagePlans = await qb.getMany();
      pagePlanIds = pagePlans.map((p) => p.id);
    }

    if (pagePlanIds.length === 0) {
      return new PaginatedResponseDto([], totalItems, page, limit);
    }

    const ids = pagePlanIds;
    const fullPlans = await this.planRepository.find({
      where: { id: In(ids) },
      relations: ['patient', 'doctor', 'items', 'items.treatment', 'items.performedProcedures'],
    });

    const orderMap = new Map(ids.map((id, i) => [id, i]));
    fullPlans.sort((a, b) => orderMap.get(a.id)! - orderMap.get(b.id)!);
    for (const p of fullPlans) {
      p.items?.sort((a, b) => a.order - b.order);
    }
    await this.attachPerformedProcedureCounts(fullPlans);

    return new PaginatedResponseDto(fullPlans, totalItems, page, limit);
  }

  async findOne(id: string): Promise<TreatmentPlan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'items', 'items.treatment', 'items.performedProcedures', 'items.performedProcedures.doctor'],
    });
    if (!plan) {
      throw new NotFoundException(`Treatment plan with ID ${id} not found`);
    }
    if (plan.items) {
      plan.items.sort((a, b) => a.order - b.order);
    }
    await this.attachPerformedProcedureCounts([plan]);
    return plan;
  }

  /**
   * Agrega proceduresPerformedCount: vinculados al plan (treatment_plan_id), a ítems del plan,
   * más heurística de no vinculados (mismo paciente/tratamiento que un ítem, sin plan ni ítem).
   */
  private async attachPerformedProcedureCounts(plans: TreatmentPlan[]): Promise<void> {
    if (plans.length === 0) return;

    const mgr = this.performedProcedureRepository.manager;

    const planIds = plans.map((p) => p.id);
    const directByPlanId = new Map<string, number>();
    if (planIds.length > 0) {
      const directRows: { planId: string; cnt: number | string }[] = await mgr.query(
        `
        SELECT treatment_plan_id AS "planId", COUNT(*)::int AS cnt
        FROM performed_procedures
        WHERE treatment_plan_id IS NOT NULL AND treatment_plan_id = ANY($1::uuid[])
        GROUP BY treatment_plan_id
        `,
        [planIds],
      );
      for (const r of directRows) {
        if (r.planId) directByPlanId.set(r.planId, Number(r.cnt));
      }
    }

    const allItemIds = plans.flatMap((p) => p.items?.map((i) => i.id) ?? []);
    const linkedByItemId = new Map<string, number>();
    if (allItemIds.length > 0) {
      const linkedRows: { itemId: string; cnt: number | string }[] = await mgr.query(
        `
        SELECT treatment_plan_item_id AS "itemId", COUNT(*)::int AS cnt
        FROM performed_procedures
        WHERE treatment_plan_item_id IS NOT NULL AND treatment_plan_item_id = ANY($1::uuid[])
        GROUP BY treatment_plan_item_id
        `,
        [allItemIds],
      );
      for (const r of linkedRows) {
        if (r.itemId) linkedByItemId.set(r.itemId, Number(r.cnt));
      }
    }

    const patientIds = [...new Set(plans.map((p) => p.patientId))];
    const unlinkedByPatientTreatment = new Map<string, number>();
    if (patientIds.length > 0) {
      const unlinkedRows: { patientId: string; treatmentId: string; cnt: number | string }[] =
        await mgr.query(
          `
          SELECT patient_id AS "patientId", treatment_id AS "treatmentId", COUNT(*)::int AS cnt
          FROM performed_procedures
          WHERE patient_id = ANY($1::uuid[])
            AND treatment_plan_item_id IS NULL
            AND treatment_plan_id IS NULL
          GROUP BY patient_id, treatment_id
          `,
          [patientIds],
        );
      for (const r of unlinkedRows) {
        unlinkedByPatientTreatment.set(`${r.patientId}:${r.treatmentId}`, Number(r.cnt));
      }
    }

    for (const plan of plans) {
      const directCount = directByPlanId.get(plan.id) ?? 0;
      let linkedSum = 0;
      const treatmentIds = new Set<string>();
      for (const item of plan.items ?? []) {
        linkedSum += linkedByItemId.get(item.id) ?? 0;
        treatmentIds.add(item.treatmentId);
      }

      let unlinkedSum = 0;
      for (const tid of treatmentIds) {
        unlinkedSum += unlinkedByPatientTreatment.get(`${plan.patientId}:${tid}`) ?? 0;
      }

      Object.assign(plan, {
        proceduresPerformedCount: directCount + linkedSum + unlinkedSum,
      });
    }
  }

  async update(id: string, updateDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return this.planRepository.save(plan);
  }

  async addItem(planId: string, createItemDto: CreatePlanItemDto): Promise<TreatmentPlanItem> {
    await this.findOne(planId);
    const item = this.itemRepository.create({
      ...createItemDto,
      treatmentPlanId: planId,
    });
    return this.itemRepository.save(item);
  }

  async updateItem(planId: string, itemId: string, updateItemDto: UpdatePlanItemDto): Promise<TreatmentPlanItem> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, treatmentPlanId: planId },
    });
    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found in plan ${planId}`);
    }
    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async removeItem(planId: string, itemId: string): Promise<void> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, treatmentPlanId: planId },
    });
    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found in plan ${planId}`);
    }
    await this.itemRepository.remove(item);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!plan) {
      throw new NotFoundException(`Treatment plan with ID ${id} not found`);
    }
    const itemIds = plan.items?.map((i) => i.id) ?? [];
    if (itemIds.length > 0) {
      await this.performedProcedureRepository.update(
        { treatmentPlanItemId: In(itemIds) },
        { treatmentPlanItemId: null },
      );
    }
    await this.performedProcedureRepository.update(
      { treatmentPlanId: id },
      { treatmentPlanId: null },
    );
    await this.planRepository.remove(plan);
  }
}
