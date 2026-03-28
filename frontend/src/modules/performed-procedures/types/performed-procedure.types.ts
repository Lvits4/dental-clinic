import type { Patient } from '../../patients/types/patient.types';
import type { Doctor } from '../../doctors/types/doctor.types';
import type { Treatment } from '../../treatments/types/treatment.types';

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
