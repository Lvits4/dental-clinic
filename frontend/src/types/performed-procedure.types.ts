import type { Patient } from './patient.types';
import type { Doctor } from './doctor.types';
import type { Treatment } from './treatment.types';
import type { TreatmentPlan, TreatmentPlanItem } from './treatment-plan.types';

export interface PerformedProcedure {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  treatmentId: string;
  treatment?: Treatment;
  treatmentPlanItemId?: string;
  treatmentPlanId?: string;
  treatmentPlanItem?: TreatmentPlanItem;
  treatmentPlan?: TreatmentPlan;
  tooth?: string;
  description?: string;
  notes?: string;
  performedAt: string;
}

export interface CreatePerformedProcedureDto {
  patientId: string;
  doctorId: string;
  treatmentId: string;
  /** En edición puede enviarse `null` para desvincular del plan/ítem. */
  treatmentPlanItemId?: string | null;
  treatmentPlanId?: string | null;
  /** En alta suele ir `undefined`; en edición puede ir `null` para borrar en el servidor. */
  tooth?: string | null;
  description?: string | null;
  notes?: string | null;
  performedAt: string;
}

/** PATCH: permite `null` en textos opcionales para borrarlos en servidor. */
export type UpdatePerformedProcedureDto = Partial<
  Omit<CreatePerformedProcedureDto, 'tooth' | 'description' | 'notes'>
> & {
  tooth?: string | null;
  description?: string | null;
  notes?: string | null;
};

export type PerformedProcedureSortBy = 'performedAt' | 'patient' | 'doctor' | 'treatment' | 'tooth';

export type PerformedProcedureSortOrder = 'asc' | 'desc';

export interface PerformedProcedureFilters {
  page?: number;
  limit?: number;
  patientId?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
  /** Búsqueda en paciente, doctor, tratamiento, pieza, descripción y notas */
  search?: string;
  sortBy?: PerformedProcedureSortBy;
  sortOrder?: PerformedProcedureSortOrder;
}
