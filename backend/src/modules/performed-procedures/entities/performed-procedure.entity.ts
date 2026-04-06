import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Treatment } from '../../treatments/entities/treatment.entity';
import { TreatmentPlanItem } from '../../treatment-plans/entities/treatment-plan-item.entity';
import { TreatmentPlan } from '../../treatment-plans/entities/treatment-plan.entity';

@Entity('performed_procedures')
export class PerformedProcedure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'treatment_id' })
  treatmentId: string;

  @ManyToOne(() => Treatment)
  @JoinColumn({ name: 'treatment_id' })
  treatment: Treatment;

  @Column({ name: 'treatment_plan_item_id', nullable: true })
  treatmentPlanItemId: string | null;

  @ManyToOne(() => TreatmentPlanItem, (item) => item.performedProcedures, { nullable: true })
  @JoinColumn({ name: 'treatment_plan_item_id' })
  treatmentPlanItem: TreatmentPlanItem;

  @Column({ name: 'treatment_plan_id', nullable: true })
  treatmentPlanId: string | null;

  @ManyToOne(() => TreatmentPlan, { nullable: true })
  @JoinColumn({ name: 'treatment_plan_id' })
  treatmentPlan: TreatmentPlan;

  @Column({ nullable: true })
  tooth: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'performed_at', type: 'timestamp' })
  performedAt: Date;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
