import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Patient } from '../../patients/entities/patient.entity';
import { ClinicalEvolution } from '../../clinical-evolutions/entities/clinical-evolution.entity';
import { User } from '../../users/entities/user.entity';

@Entity('clinical_files')
export class ClinicalFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'clinical_evolution_id', nullable: true })
  clinicalEvolutionId: string;

  @ManyToOne(() => ClinicalEvolution, { nullable: true })
  @JoinColumn({ name: 'clinical_evolution_id' })
  clinicalEvolution: ClinicalEvolution;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_key' })
  fileKey: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'file_size', type: 'int' })
  fileSize: number;

  @Column({ name: 'uploaded_by' })
  uploadedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
