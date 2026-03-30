import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createDto: CreatePerformedProcedureDto): Promise<PerformedProcedure> {
    const procedure = this.procedureRepository.create(createDto);
    const saved = await this.procedureRepository.save(procedure);

    // Si viene vinculado a un ítem del plan, actualizarlo automáticamente
    if (createDto.treatmentPlanItemId) {
      const item = await this.planItemRepository.findOne({
        where: { id: createDto.treatmentPlanItemId },
      });

      if (item) {
        // Marcar el ítem como completado
        await this.planItemRepository.update(item.id, {
          status: TreatmentPlanStatus.COMPLETED,
        });

        // Revisar si todos los ítems del plan están completados o cancelados
        const allItems = await this.planItemRepository.find({
          where: { treatmentPlanId: item.treatmentPlanId },
        });

        const activeItems = allItems.filter(
          (i) => i.status !== TreatmentPlanStatus.CANCELLED,
        );
        const allDone = activeItems.every(
          (i) => i.id === item.id || i.status === TreatmentPlanStatus.COMPLETED,
        );

        const plan = await this.planRepository.findOne({
          where: { id: item.treatmentPlanId },
        });

        if (plan && plan.status !== TreatmentPlanStatus.CANCELLED) {
          const newPlanStatus = allDone
            ? TreatmentPlanStatus.COMPLETED
            : TreatmentPlanStatus.IN_PROGRESS;
          await this.planRepository.update(plan.id, { status: newPlanStatus });
        }
      }
    }

    return saved;
  }

  async update(id: string, updateDto: UpdatePerformedProcedureDto): Promise<PerformedProcedure> {
    const procedure = await this.findOne(id);
    const { treatmentPlanItemId: _ignored, performedAt, ...rest } = updateDto;

    (Object.entries(rest) as [keyof typeof rest, (typeof rest)[keyof typeof rest]][]).forEach(([key, value]) => {
      if (value !== undefined) {
        (procedure as unknown as Record<string, unknown>)[key as string] = value;
      }
    });
    if (performedAt !== undefined) {
      procedure.performedAt = new Date(performedAt);
    }

    await this.procedureRepository.save(procedure);
    return this.findOne(id);
  }

  async findAll(filterDto: FilterPerformedProcedureDto): Promise<PaginatedResponseDto<PerformedProcedure>> {
    const { page = 1, limit = 10, patientId, doctorId, dateFrom, dateTo, sortBy, sortOrder } = filterDto;
    const query = this.procedureRepository
      .createQueryBuilder('procedure')
      .leftJoinAndSelect('procedure.patient', 'patient')
      .leftJoinAndSelect('procedure.doctor', 'doctor')
      .leftJoinAndSelect('procedure.treatment', 'treatment');

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
      relations: ['patient', 'doctor', 'treatment', 'treatmentPlanItem'],
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
    await this.procedureRepository.remove(procedure);
  }
}
