import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Treatment } from '../entities/treatment.entity';
import { CreateTreatmentDto } from '../dto/create-treatment.dto';
import { UpdateTreatmentDto } from '../dto/update-treatment.dto';
import {
  FilterTreatmentDto,
  TreatmentSortBy,
  TreatmentSortOrder,
} from '../dto/filter-treatment.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

function applyTreatmentSort(
  query: SelectQueryBuilder<Treatment>,
  sortBy: TreatmentSortBy,
  sortOrder: TreatmentSortOrder,
): void {
  const dir = sortOrder === TreatmentSortOrder.ASC ? 'ASC' : 'DESC';
  switch (sortBy) {
    case TreatmentSortBy.NAME:
      query.orderBy('treatment.name', dir);
      break;
    case TreatmentSortBy.CATEGORY:
      query.orderBy('treatment.category', dir).addOrderBy('treatment.name', 'ASC');
      break;
    case TreatmentSortBy.DEFAULT_PRICE:
      query.orderBy('treatment.defaultPrice', dir).addOrderBy('treatment.name', 'ASC');
      break;
    case TreatmentSortBy.CREATED_AT:
    default:
      query.orderBy('treatment.createdAt', dir);
      break;
  }
}

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

  async findAll(filterDto: FilterTreatmentDto): Promise<PaginatedResponseDto<Treatment>> {
    const {
      page = 1,
      limit = 10,
      name,
      category,
      isActive,
      sortBy,
      sortOrder,
    } = filterDto;

    const query = this.treatmentRepository.createQueryBuilder('treatment');

    if (name?.trim()) {
      query.andWhere('LOWER(treatment.name) LIKE LOWER(:name)', {
        name: `%${name.trim()}%`,
      });
    }
    if (category?.trim()) {
      query.andWhere('treatment.category = :category', { category: category.trim() });
    }
    if (isActive === true || isActive === false) {
      query.andWhere('treatment.isActive = :isActive', { isActive });
    }

    const resolvedBy = sortBy ?? TreatmentSortBy.NAME;
    const resolvedOrder =
      sortOrder ??
      (resolvedBy === TreatmentSortBy.CREATED_AT
        ? TreatmentSortOrder.DESC
        : TreatmentSortOrder.ASC);
    applyTreatmentSort(query, resolvedBy, resolvedOrder);

    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
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
