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
import { ClinicalRecord } from '../../clinical-records/entities/clinical-record.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('clinical_evolutions')
export class ClinicalEvolution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'clinical_record_id' })
  clinicalRecordId: string;

  @ManyToOne(() => ClinicalRecord)
  @JoinColumn({ name: 'clinical_record_id' })
  clinicalRecord: ClinicalRecord;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ name: 'consultation_reason', type: 'text' })
  consultationReason: string;

  @Column({ type: 'text' })
  findings: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ name: 'procedure_performed', type: 'text' })
  procedurePerformed: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
