import type { Patient } from './patient.types';
import type { Doctor } from './doctor.types';
import type { Treatment } from './treatment.types';

export interface PerformedProcedure {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  treatmentId: string;
  treatment?: Treatment;
  treatmentPlanItemId?: string;
  tooth?: string;
  description?: string;
  notes?: string;
  performedAt: string;
}

export interface CreatePerformedProcedureDto {
  patientId: string;
  doctorId: string;
  treatmentId: string;
  treatmentPlanItemId?: string;
  tooth?: string;
  description?: string;
  notes?: string;
  performedAt: string;
}

export interface PerformedProcedureFilters {
  page?: number;
  limit?: number;
  patientId?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
}
