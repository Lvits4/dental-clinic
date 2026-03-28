import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treatment } from '../entities/treatment.entity';
import { CreateTreatmentDto } from '../dto/create-treatment.dto';
import { UpdateTreatmentDto } from '../dto/update-treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
  ) {}

  async create(createDto: CreateTreatmentDto): Promise<Treatment> {
    const treatment = this.treatmentRepository.create(createDto);
    return this.treatmentRepository.save(treatment);
  }

  async findAll(): Promise<Treatment[]> {
    return this.treatmentRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Treatment> {
    const treatment = await this.treatmentRepository.findOne({ where: { id } });
    if (!treatment) {
      throw new NotFoundException(`Treatment with ID ${id} not found`);
    }
    return treatment;
  }

  async update(id: string, updateDto: UpdateTreatmentDto): Promise<Treatment> {
    const treatment = await this.findOne(id);
    Object.assign(treatment, updateDto);
    return this.treatmentRepository.save(treatment);
  }

  async toggle(id: string): Promise<Treatment> {
    const treatment = await this.findOne(id);
    treatment.isActive = !treatment.isActive;
    return this.treatmentRepository.save(treatment);
  }
}
