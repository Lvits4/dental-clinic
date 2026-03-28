import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalEvolution } from '../entities/clinical-evolution.entity';
import { CreateClinicalEvolutionDto } from '../dto/create-clinical-evolution.dto';
import { FilterClinicalEvolutionDto } from '../dto/filter-clinical-evolution.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class ClinicalEvolutionsService {
  constructor(
    @InjectRepository(ClinicalEvolution)
    private readonly evolutionRepository: Repository<ClinicalEvolution>,
  ) {}

  async create(createDto: CreateClinicalEvolutionDto): Promise<ClinicalEvolution> {
    const evolution = this.evolutionRepository.create(createDto);
    return this.evolutionRepository.save(evolution);
  }

  async findAll(filterDto: FilterClinicalEvolutionDto): Promise<PaginatedResponseDto<ClinicalEvolution>> {
    const { page = 1, limit = 10, recordId, doctorId, dateFrom, dateTo } = filterDto;
    const query = this.evolutionRepository
      .createQueryBuilder('evolution')
      .leftJoinAndSelect('evolution.doctor', 'doctor')
      .leftJoinAndSelect('evolution.clinicalRecord', 'clinicalRecord');

    if (recordId) {
      query.andWhere('evolution.clinicalRecordId = :recordId', { recordId });
    }
    if (doctorId) {
      query.andWhere('evolution.doctorId = :doctorId', { doctorId });
    }
    if (dateFrom) {
      query.andWhere('evolution.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('evolution.date <= :dateTo', { dateTo });
    }

    query.orderBy('evolution.date', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<ClinicalEvolution> {
    // Search by evolution ID first, then by clinical record ID
    const evolution = await this.evolutionRepository.findOne({
      where: [{ id }, { clinicalRecordId: id }],
      relations: ['doctor', 'clinicalRecord', 'clinicalRecord.patient'],
    });
    if (!evolution) {
      throw new NotFoundException(`Clinical evolution with ID or clinical record ID ${id} not found`);
    }
    return evolution;
  }
}
