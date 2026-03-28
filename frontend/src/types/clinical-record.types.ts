import type { Patient } from './patient.types';

export interface ClinicalRecord {
  id: string;
  patientId: string;
  patient?: Patient;
  medicalBackground?: string;
  dentalBackground?: string;
  consultationReason?: string;
  diagnosis?: string;
  observations?: string;
}

export interface CreateClinicalRecordDto {
  patientId: string;
  medicalBackground?: string;
  dentalBackground?: string;
  consultationReason?: string;
  diagnosis?: string;
  observations?: string;
}

export interface UpdateClinicalRecordDto {
  medicalBackground?: string;
  dentalBackground?: string;
  consultationReason?: string;
  diagnosis?: string;
  observations?: string;
}
