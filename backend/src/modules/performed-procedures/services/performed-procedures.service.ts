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
    if (createDto.treatmentPlanItemId && createDto.treatmentPlanId) {
      throw new BadRequestException('No puede vincular a un plan y a un ítem a la vez');
    }

    let linkedItem: TreatmentPlanItem | null = null;
    let linkedPlan: TreatmentPlan | null = null;

    if (createDto.treatmentPlanItemId) {
      linkedItem = await this.planItemRepository.findOne({
        where: { id: createDto.treatmentPlanItemId },
        relations: ['treatmentPlan'],
      });
      if (!linkedItem) {
        throw new BadRequestException('El ítem del plan indicado no existe');
      }
      if (linkedItem.treatmentId !== createDto.treatmentId) {
        throw new BadRequestException(
          'El tratamiento no coincide con el ítem del plan seleccionado',
        );
      }
      if (!linkedItem.treatmentPlan || linkedItem.treatmentPlan.patientId !== createDto.patientId) {
        throw new BadRequestException('El plan no corresponde al paciente del procedimiento');
      }
      if (
        linkedItem.status === TreatmentPlanStatus.CANCELLED ||
        linkedItem.status === TreatmentPlanStatus.COMPLETED
      ) {
        throw new BadRequestException(
          'No se puede vincular a un ítem cancelado o ya completado',
        );
      }
    }

    if (createDto.treatmentPlanId) {
      linkedPlan = await this.planRepository.findOne({
        where: { id: createDto.treatmentPlanId },
      });
      if (!linkedPlan) {
        throw new BadRequestException('El plan de tratamiento indicado no existe');
      }
      if (linkedPlan.patientId !== createDto.patientId) {
        throw new BadRequestException('El plan no corresponde al paciente del procedimiento');
      }
      if (linkedPlan.status === TreatmentPlanStatus.CANCELLED) {
        throw new BadRequestException('No se puede vincular a un plan cancelado');
      }
    }

    const procedure = this.procedureRepository.create(createDto);
    const saved = await this.procedureRepository.save(procedure);

    if (createDto.treatmentPlanItemId && linkedItem) {
      await this.planItemRepository.update(linkedItem.id, {
        status: TreatmentPlanStatus.COMPLETED,
      });

      const allItems = await this.planItemRepository.find({
        where: { treatmentPlanId: linkedItem.treatmentPlanId },
      });

      const activeItems = allItems.filter(
        (i) => i.status !== TreatmentPlanStatus.CANCELLED,
      );
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
    } else if (createDto.treatmentPlanId && linkedPlan) {
      if (linkedPlan.status === TreatmentPlanStatus.PENDING) {
        await this.planRepository.update(linkedPlan.id, {
          status: TreatmentPlanStatus.IN_PROGRESS,
        });
      }
    }

    return saved;
  }

  async update(id: string, updateDto: UpdatePerformedProcedureDto): Promise<PerformedProcedure> {
    const procedure = await this.findOne(id);
    const {
      treatmentPlanItemId: _ignoredItem,
      treatmentPlanId: _ignoredPlan,
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

    await this.procedureRepository.save(procedure);
    return this.findOne(id);
  }

  async findAll(filterDto: FilterPerformedProcedureDto): Promise<PaginatedResponseDto<PerformedProcedure>> {
    const { page = 1, limit = 10, patientId, doctorId, dateFrom, dateTo, search, sortBy, sortOrder } =
      filterDto;
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
    await this.procedureRepository.remove(procedure);
  }
}
