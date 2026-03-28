import type { Doctor } from './doctor.types';

export interface ClinicalEvolution {
  id: string;
  clinicalRecordId: string;
  doctorId: string;
  doctor?: Doctor;
  date: string;
  consultationReason: string;
  findings: string;
  diagnosis: string;
  procedurePerformed: string;
  recommendations?: string;
  observations?: string;
}

export interface CreateClinicalEvolutionDto {
  clinicalRecordId: string;
  doctorId: string;
  date: string;
  consultationReason: string;
  findings: string;
  diagnosis: string;
  procedurePerformed: string;
  recommendations?: string;
  observations?: string;
}

export interface ClinicalEvolutionFilters {
  page?: number;
  limit?: number;
  recordId?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
}
