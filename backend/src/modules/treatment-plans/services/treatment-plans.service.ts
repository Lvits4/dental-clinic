import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreatmentPlan } from '../entities/treatment-plan.entity';
import { TreatmentPlanItem } from '../entities/treatment-plan-item.entity';
import { CreateTreatmentPlanDto } from '../dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from '../dto/update-treatment-plan.dto';
import { CreatePlanItemDto } from '../dto/create-plan-item.dto';
import { UpdatePlanItemDto } from '../dto/update-plan-item.dto';

@Injectable()
export class TreatmentPlansService {
  constructor(
    @InjectRepository(TreatmentPlan)
    private readonly planRepository: Repository<TreatmentPlan>,
    @InjectRepository(TreatmentPlanItem)
    private readonly itemRepository: Repository<TreatmentPlanItem>,
  ) {}

  async create(createDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    const { items, ...planData } = createDto;
    const plan = this.planRepository.create(planData);
    const savedPlan = await this.planRepository.save(plan);

    if (items?.length) {
      const planItems = items.map((item) =>
        this.itemRepository.create({ ...item, treatmentPlanId: savedPlan.id }),
      );
      await this.itemRepository.save(planItems);
    }

    return this.findOne(savedPlan.id);
  }

  async findAll(): Promise<TreatmentPlan[]> {
    return this.planRepository.find({
      relations: ['patient', 'doctor', 'items', 'items.treatment', 'items.performedProcedures'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TreatmentPlan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'items', 'items.treatment', 'items.performedProcedures', 'items.performedProcedures.doctor'],
    });
    if (!plan) {
      throw new NotFoundException(`Treatment plan with ID ${id} not found`);
    }
    if (plan.items) {
      plan.items.sort((a, b) => a.order - b.order);
    }
    return plan;
  }

  async update(id: string, updateDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return this.planRepository.save(plan);
  }

  async addItem(planId: string, createItemDto: CreatePlanItemDto): Promise<TreatmentPlanItem> {
    await this.findOne(planId);
    const item = this.itemRepository.create({
      ...createItemDto,
      treatmentPlanId: planId,
    });
    return this.itemRepository.save(item);
  }

  async updateItem(planId: string, itemId: string, updateItemDto: UpdatePlanItemDto): Promise<TreatmentPlanItem> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, treatmentPlanId: planId },
    });
    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found in plan ${planId}`);
    }
    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async removeItem(planId: string, itemId: string): Promise<void> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, treatmentPlanId: planId },
    });
    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found in plan ${planId}`);
    }
    await this.itemRepository.remove(item);
  }
}
