import type { Patient } from '../../patients/types/patient.types';
import type { Doctor } from '../../doctors/types/doctor.types';
import type { Treatment } from '../../treatments/types/treatment.types';

export enum TreatmentPlanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface TreatmentPlanItem {
  id: string;
  treatmentPlanId: string;
  treatmentId: string;
  treatment?: Treatment;
  tooth?: string;
  notes?: string;
  status: TreatmentPlanStatus;
  order: number;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  status: TreatmentPlanStatus;
  observations?: string;
  items?: TreatmentPlanItem[];
}

export interface CreateTreatmentPlanDto {
  patientId: string;
  doctorId: string;
  observations?: string;
  items?: { treatmentId: string; tooth?: string; notes?: string; order?: number }[];
}

export const PLAN_STATUS_CONFIG: Record<TreatmentPlanStatus, { label: string; className: string }> = {
  [TreatmentPlanStatus.PENDING]: { label: 'Pendiente', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  [TreatmentPlanStatus.APPROVED]: { label: 'Aprobado', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  [TreatmentPlanStatus.REJECTED]: { label: 'Rechazado', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  [TreatmentPlanStatus.COMPLETED]: { label: 'Completado', className: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400' },
  [TreatmentPlanStatus.CANCELLED]: { label: 'Cancelado', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};
