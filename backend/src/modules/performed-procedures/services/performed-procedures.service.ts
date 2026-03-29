import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformedProcedure } from '../entities/performed-procedure.entity';
import { TreatmentPlanItem } from '../../treatment-plans/entities/treatment-plan-item.entity';
import { TreatmentPlan } from '../../treatment-plans/entities/treatment-plan.entity';
import { CreatePerformedProcedureDto } from '../dto/create-performed-procedure.dto';
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

  async findAll(filterDto: FilterPerformedProcedureDto): Promise<PaginatedResponseDto<PerformedProcedure>> {
    const { page = 1, limit = 10, patientId, doctorId, dateFrom, dateTo } = filterDto;
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

    query.orderBy('procedure.performedAt', 'DESC');
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
}
