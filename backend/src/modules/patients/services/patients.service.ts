import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { FilterPatientDto } from '../dto/filter-patient.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  async findAll(filterDto: FilterPatientDto): Promise<PaginatedResponseDto<Patient>> {
    const { page = 1, limit = 10, name, phone, email, isActive } = filterDto;
    const query = this.patientRepository.createQueryBuilder('patient');

    if (name) {
      query.andWhere(
        '(LOWER(patient.first_name) LIKE LOWER(:name) OR LOWER(patient.last_name) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }
    if (phone) {
      query.andWhere('patient.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (email) {
      query.andWhere('patient.email LIKE :email', { email: `%${email}%` });
    }
    if (isActive !== undefined) {
      query.andWhere('patient.is_active = :isActive', { isActive });
    }

    query.orderBy('patient.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.isActive = false;
    return this.patientRepository.save(patient);
  }
}
