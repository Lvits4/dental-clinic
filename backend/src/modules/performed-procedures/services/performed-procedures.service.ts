import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformedProcedure } from '../entities/performed-procedure.entity';
import { TreatmentPlanItem } from '../../treatment-plans/entities/treatment-plan-item.entity';
import { TreatmentPlan } from '../../treatment-plans/entities/treatment-plan.entity';
import { CreatePerformedProcedureDto } from '../dto/create-performed-procedure.dto';
import { UpdatePerformedProcedureDto } from '../dto/update-performed-procedure.dto';
import { FilterPerformedProcedureDto } from '../dto/filter-performed-procedure.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { TreatmentPlanStatus } from '../../../common/enums/treatment-plan-status.enum';

type PlanLinkState = { itemId: string | null; planId: string | null };

@Injectable()
export class PerformedProceduresService {
  constructor(
    @InjectRepository(PerformedProcedure)
    private readonly procedureRepository: Repository<PerformedProcedure>,
    @InjectRepository(TreatmentPlanItem)
    private readonly planItemRepository: Repository<TreatmentPlanItem>,
    @InjectRepository(TreatmentPlan)
    private readonly planRepository: Repository<TreatmentPlan>,
  ) {}

  private resolvePlanLinksFromUpdate(current: PlanLinkState, dto: UpdatePerformedProcedureDto): PlanLinkState {
    let { itemId, planId } = current;

    if (dto.treatmentPlanItemId !== undefined) {
      itemId = dto.treatmentPlanItemId;
      if (itemId) planId = null;
    }
    if (dto.treatmentPlanId !== undefined) {
      planId = dto.treatmentPlanId;
      if (planId) itemId = null;
    }

    if (itemId && planId) {
      throw new BadRequestException('No puede vincular a un plan y a un ítem a la vez');
    }
    return { itemId, planId };
  }

  private async validatePlanLinks(
    patientId: string,
    treatmentId: string,
    itemId: string | null,
    planId: string | null,
    opts?: { allowCompletedItemId?: string | null },
  ): Promise<{ linkedItem: TreatmentPlanItem | null; linkedPlan: TreatmentPlan | null }> {
    const hasItem = !!itemId;
    const hasPlan = !!planId;
    if (hasItem && hasPlan) {
      throw new BadRequestException('No puede vincular a un plan y a un ítem a la vez');
    }

    let linkedItem: TreatmentPlanItem | null = null;
    let linkedPlan: TreatmentPlan | null = null;

    if (hasItem) {
      linkedItem = await this.planItemRepository.findOne({
        where: { id: itemId! },
        relations: ['treatmentPlan'],
      });
      if (!linkedItem) {
        throw new BadRequestException('El ítem del plan indicado no existe');
      }
      if (linkedItem.treatmentId !== treatmentId) {
        throw new BadRequestException(
          'El tratamiento no coincide con el ítem del plan seleccionado',
        );
      }
      if (!linkedItem.treatmentPlan || linkedItem.treatmentPlan.patientId !== patientId) {
        throw new BadRequestException('El plan no corresponde al paciente del procedimiento');
      }
      const allowCompleted = opts?.allowCompletedItemId === linkedItem.id;
      if (
        linkedItem.status === TreatmentPlanStatus.CANCELLED ||
        (linkedItem.status === TreatmentPlanStatus.COMPLETED && !allowCompleted)
      ) {
        throw new BadRequestException(
          'No se puede vincular a un ítem cancelado o ya completado',
        );
      }
    }

    if (hasPlan) {
      linkedPlan = await this.planRepository.findOne({
        where: { id: planId! },
      });
      if (!linkedPlan) {
        throw new BadRequestException('El plan de tratamiento indicado no existe');
      }
      if (linkedPlan.patientId !== patientId) {
        throw new BadRequestException('El plan no corresponde al paciente del procedimiento');
      }
      if (linkedPlan.status === TreatmentPlanStatus.CANCELLED) {
        throw new BadRequestException('No se puede vincular a un plan cancelado');
      }
    }

    return { linkedItem, linkedPlan };
  }

  private async applyItemLinkSideEffects(linkedItem: TreatmentPlanItem): Promise<void> {
    await this.planItemRepository.update(linkedItem.id, {
      status: TreatmentPlanStatus.COMPLETED,
    });

    const allItems = await this.planItemRepository.find({
      where: { treatmentPlanId: linkedItem.treatmentPlanId },
    });

    const activeItems = allItems.filter((i) => i.status !== TreatmentPlanStatus.CANCELLED);
    const linkedId = linkedItem.id;
    const allDone = activeItems.every(
      (i) => i.id === linkedId || i.status === TreatmentPlanStatus.COMPLETED,
    );

    const plan = await this.planRepository.findOne({
      where: { id: linkedItem.treatmentPlanId },
    });

    if (plan && plan.status !== TreatmentPlanStatus.CANCELLED) {
      const newPlanStatus = allDone
        ? TreatmentPlanStatus.COMPLETED
        : TreatmentPlanStatus.IN_PROGRESS;
      await this.planRepository.update(plan.id, { status: newPlanStatus });
    }
  }

  private async applyPlanOnlySideEffects(linkedPlan: TreatmentPlan): Promise<void> {
    if (linkedPlan.status === TreatmentPlanStatus.PENDING) {
      await this.planRepository.update(linkedPlan.id, {
        status: TreatmentPlanStatus.IN_PROGRESS,
      });
    }
  }

  /** Si ningún procedimiento queda enlazado al ítem, revierte COMPLETED → IN_PROGRESS y el plan si aplica. */
  private async maybeRevertItemAfterUnlink(itemId: string): Promise<void> {
    const n = await this.procedureRepository.count({ where: { treatmentPlanItemId: itemId } });
    if (n > 0) return;

    const item = await this.planItemRepository.findOne({ where: { id: itemId } });
    if (!item || item.status !== TreatmentPlanStatus.COMPLETED) return;

    await this.planItemRepository.update(itemId, { status: TreatmentPlanStatus.IN_PROGRESS });

    const plan = await this.planRepository.findOne({ where: { id: item.treatmentPlanId } });
    if (plan && plan.status === TreatmentPlanStatus.COMPLETED) {
      await this.planRepository.update(plan.id, { status: TreatmentPlanStatus.IN_PROGRESS });
    }
  }

  async create(createDto: CreatePerformedProcedureDto): Promise<PerformedProcedure> {
    const itemId = createDto.treatmentPlanItemId ?? null;
    const planId = createDto.treatmentPlanId ?? null;

    const { linkedItem, linkedPlan } = await this.validatePlanLinks(
      createDto.patientId,
      createDto.treatmentId,
      itemId,
      planId,
    );

    const procedure = this.procedureRepository.create({
      ...createDto,
      treatmentPlanItemId: itemId,
      treatmentPlanId: planId,
    });
    const saved = await this.procedureRepository.save(procedure);

    if (itemId && linkedItem) {
      await this.applyItemLinkSideEffects(linkedItem);
    } else if (planId && linkedPlan) {
      await this.applyPlanOnlySideEffects(linkedPlan);
    }

    return saved;
  }

  async update(id: string, updateDto: UpdatePerformedProcedureDto): Promise<PerformedProcedure> {
    const procedure = await this.findOne(id);

    const {
      treatmentPlanItemId: dtoItem,
      treatmentPlanId: dtoPlan,
      treatmentId: dtoTreatmentId,
      performedAt,
      ...rest
    } = updateDto;

    (Object.entries(rest) as [keyof typeof rest, (typeof rest)[keyof typeof rest]][]).forEach(([key, value]) => {
      if (value !== undefined) {
        (procedure as unknown as Record<string, unknown>)[key as string] = value;
      }
    });
    if (performedAt !== undefined) {
      procedure.performedAt = new Date(performedAt);
    }
    if (dtoTreatmentId !== undefined) {
      procedure.treatmentId = dtoTreatmentId;
    }

    const oldItemId = procedure.treatmentPlanItemId;
    const oldPlanId = procedure.treatmentPlanId;

    const { itemId: newItemId, planId: newPlanId } = this.resolvePlanLinksFromUpdate(
      { itemId: oldItemId, planId: oldPlanId },
      { treatmentPlanItemId: dtoItem, treatmentPlanId: dtoPlan },
    );

    await this.validatePlanLinks(procedure.patientId, procedure.treatmentId, newItemId, newPlanId, {
      allowCompletedItemId:
        newItemId && oldItemId && newItemId === oldItemId ? oldItemId : undefined,
    });

    procedure.treatmentPlanItemId = newItemId;
    procedure.treatmentPlanId = newPlanId;

    await this.procedureRepository.save(procedure);

    if (oldItemId && oldItemId !== newItemId) {
      await this.maybeRevertItemAfterUnlink(oldItemId);
    }

    if (newItemId && newItemId !== oldItemId) {
      const linkedItem = await this.planItemRepository.findOne({
        where: { id: newItemId },
        relations: ['treatmentPlan'],
      });
      if (linkedItem) {
        await this.applyItemLinkSideEffects(linkedItem);
      }
    }

    if (newPlanId && newPlanId !== oldPlanId && !newItemId) {
      const linkedPlan = await this.planRepository.findOne({ where: { id: newPlanId } });
      if (linkedPlan) {
        await this.applyPlanOnlySideEffects(linkedPlan);
      }
    }

    return this.findOne(id);
  }

  async findAll(filterDto: FilterPerformedProcedureDto): Promise<PaginatedResponseDto<PerformedProcedure>> {
    const { page = 1, limit = 10, patientId, doctorId, dateFrom, dateTo, search, sortBy, sortOrder } =
      filterDto;
    const query = this.procedureRepository
      .createQueryBuilder('procedure')
      .leftJoinAndSelect('procedure.patient', 'patient')
      .leftJoinAndSelect('procedure.doctor', 'doctor')
      .leftJoinAndSelect('procedure.treatment', 'treatment')
      .leftJoinAndSelect('procedure.treatmentPlanItem', 'treatmentPlanItem')
      .leftJoinAndSelect('procedure.treatmentPlan', 'treatmentPlan');

    if (patientId) {
      query.andWhere('procedure.patientId = :patientId', { patientId });
    }
    if (doctorId) {
      query.andWhere('procedure.doctorId = :doctorId', { doctorId });
    }
    if (dateFrom) {
      query.andWhere('procedure.performedAt >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('procedure.performedAt <= :dateTo', { dateTo });
    }

    if (search) {
      const sanitized = search.replace(/[%_\\]/g, '');
      if (sanitized.length > 0) {
        const searchTerm = `%${sanitized}%`;
        query.andWhere(
          `(
            patient.firstName ILIKE :searchTerm OR
            patient.lastName ILIKE :searchTerm OR
            doctor.firstName ILIKE :searchTerm OR
            doctor.lastName ILIKE :searchTerm OR
            treatment.name ILIKE :searchTerm OR
            procedure.tooth ILIKE :searchTerm OR
            COALESCE(procedure.description, '') ILIKE :searchTerm OR
            COALESCE(procedure.notes, '') ILIKE :searchTerm
          )`,
          { searchTerm },
        );
      }
    }

    const dir = sortOrder === 'asc' ? 'ASC' : 'DESC';
    const by = sortBy ?? 'performedAt';
    switch (by) {
      case 'patient':
        query.orderBy('patient.lastName', dir).addOrderBy('patient.firstName', dir).addOrderBy('procedure.id', 'DESC');
        break;
      case 'doctor':
        query.orderBy('doctor.lastName', dir).addOrderBy('doctor.firstName', dir).addOrderBy('procedure.id', 'DESC');
        break;
      case 'treatment':
        query.orderBy('treatment.name', dir).addOrderBy('procedure.id', 'DESC');
        break;
      case 'tooth':
        query.orderBy('procedure.tooth', dir).addOrderBy('procedure.performedAt', 'DESC');
        break;
      default:
        query.orderBy('procedure.performedAt', dir).addOrderBy('procedure.id', 'DESC');
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<PerformedProcedure> {
    const procedure = await this.procedureRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'treatment', 'treatmentPlanItem', 'treatmentPlan'],
    });
    if (!procedure) {
      throw new NotFoundException(`Performed procedure with ID ${id} not found`);
    }
    return procedure;
  }

  async remove(id: string): Promise<void> {
    const procedure = await this.procedureRepository.findOne({ where: { id } });
    if (!procedure) {
      throw new NotFoundException(`Performed procedure with ID ${id} not found`);
    }
    const itemId = procedure.treatmentPlanItemId;
    await this.procedureRepository.remove(procedure);
    if (itemId) {
      await this.maybeRevertItemAfterUnlink(itemId);
    }
  }
}
