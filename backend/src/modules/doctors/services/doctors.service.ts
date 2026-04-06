import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import {
  FilterDoctorDto,
  DoctorSortBy,
  DoctorSortOrder,
} from '../dto/filter-doctor.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Check for duplicate license number
    const existingDoctor = await this.doctorRepository.findOne({
      where: { licenseNumber: createDoctorDto.licenseNumber },
    });
    if (existingDoctor) {
      throw new BadRequestException(
        `A doctor with license number ${createDoctorDto.licenseNumber} already exists.`,
      );
    }

    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async findAll(filterDto: FilterDoctorDto): Promise<PaginatedResponseDto<Doctor>> {
    const {
      page = 1,
      limit = 10,
      isActive,
      search,
      sortBy = DoctorSortBy.NAME,
      sortOrder = DoctorSortOrder.ASC,
    } = filterDto;

    /** Sin `isActive` en query: solo activos. `isActive=false` devuelve solo inactivos. */
    const onlyActive = isActive !== false;

    const qb = this.doctorRepository
      .createQueryBuilder('doctor')
      .where('doctor.is_active = :active', { active: onlyActive });

    if (search) {
      const q = `%${search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(doctor.first_name) LIKE :q OR LOWER(doctor.last_name) LIKE :q OR LOWER(doctor.specialty) LIKE :q OR LOWER(doctor.email) LIKE :q OR LOWER(doctor.phone) LIKE :q OR LOWER(doctor.license_number) LIKE :q)',
        { q },
      );
    }

    const dir = sortOrder === DoctorSortOrder.DESC ? 'DESC' : 'ASC';
    switch (sortBy) {
      case DoctorSortBy.SPECIALTY:
        qb.orderBy('doctor.specialty', dir);
        break;
      case DoctorSortBy.PHONE:
        qb.orderBy('doctor.phone', dir);
        break;
      case DoctorSortBy.EMAIL:
        qb.orderBy('doctor.email', dir);
        break;
      case DoctorSortBy.LICENSE_NUMBER:
        qb.orderBy('doctor.license_number', dir);
        break;
      case DoctorSortBy.IS_ACTIVE:
        qb.orderBy('doctor.is_active', dir);
        break;
      case DoctorSortBy.NAME:
      default:
        qb.orderBy('doctor.last_name', dir).addOrderBy('doctor.first_name', dir);
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, totalItems] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: string): Promise<Doctor> {
    const doctor = await this.findOne(id);
    doctor.isActive = false;
    return this.doctorRepository.save(doctor);
  }
}
