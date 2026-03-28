import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalRecord } from '../entities/clinical-record.entity';
import { CreateClinicalRecordDto } from '../dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from '../dto/update-clinical-record.dto';
import { FilterClinicalRecordDto } from '../dto/filter-clinical-record.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class ClinicalRecordsService {
  constructor(
    @InjectRepository(ClinicalRecord)
    private readonly clinicalRecordRepository: Repository<ClinicalRecord>,
  ) {}

  async create(createDto: CreateClinicalRecordDto): Promise<ClinicalRecord> {
    const existing = await this.clinicalRecordRepository.findOne({
      where: { patientId: createDto.patientId },
    });
    if (existing) {
      throw new ConflictException('Patient already has a clinical record');
    }
    const record = this.clinicalRecordRepository.create(createDto);
    return this.clinicalRecordRepository.save(record);
  }

  async findAll(filterDto: FilterClinicalRecordDto): Promise<PaginatedResponseDto<ClinicalRecord>> {
    const { page = 1, limit = 10, patientId } = filterDto;
    const query = this.clinicalRecordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.patient', 'patient');

    if (patientId) {
      query.andWhere('record.patient_id = :patientId', { patientId });
    }

    query.orderBy('record.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findByPatient(patientId: string): Promise<ClinicalRecord> {
    const record = await this.clinicalRecordRepository.findOne({
      where: { patientId },
      relations: ['patient'],
    });
    if (!record) {
      throw new NotFoundException(`Clinical record for patient ${patientId} not found`);
    }
    return record;
  }

  async findOne(id: string): Promise<ClinicalRecord> {
    const record = await this.clinicalRecordRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!record) {
      throw new NotFoundException(`Clinical record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: UpdateClinicalRecordDto): Promise<ClinicalRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.clinicalRecordRepository.save(record);
  }
}
