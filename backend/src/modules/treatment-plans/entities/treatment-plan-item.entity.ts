import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TreatmentPlan } from './treatment-plan.entity';
import { Treatment } from '../../treatments/entities/treatment.entity';
import { TreatmentPlanStatus } from '../../../common/enums/treatment-plan-status.enum';

@Entity('treatment_plan_items')
export class TreatmentPlanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'treatment_plan_id' })
  treatmentPlanId: string;

  @ManyToOne(() => TreatmentPlan, (plan) => plan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'treatment_plan_id' })
  treatmentPlan: TreatmentPlan;

  @Column({ name: 'treatment_id' })
  treatmentId: string;

  @ManyToOne(() => Treatment)
  @JoinColumn({ name: 'treatment_id' })
  treatment: Treatment;

  @Column({ nullable: true })
  tooth: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: TreatmentPlanStatus,
    default: TreatmentPlanStatus.PENDING,
  })
  status: TreatmentPlanStatus;

  @Column({ name: 'order', type: 'int', default: 0 })
  order: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
