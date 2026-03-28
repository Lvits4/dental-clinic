import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

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

  async findAll(isActive?: boolean): Promise<Doctor[]> {
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return this.doctorRepository.find({ where });
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
