import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformedProcedure } from '../entities/performed-procedure.entity';
import { CreatePerformedProcedureDto } from '../dto/create-performed-procedure.dto';
import { FilterPerformedProcedureDto } from '../dto/filter-performed-procedure.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class PerformedProceduresService {
  constructor(
    @InjectRepository(PerformedProcedure)
    private readonly procedureRepository: Repository<PerformedProcedure>,
  ) {}

  async create(createDto: CreatePerformedProcedureDto): Promise<PerformedProcedure> {
    const procedure = this.procedureRepository.create(createDto);
    return this.procedureRepository.save(procedure);
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
