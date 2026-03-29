import type { Patient } from './patient.types';
import type { Doctor } from './doctor.types';
import type { Treatment } from './treatment.types';
import { TreatmentPlanStatus } from '../enums';

export interface PerformedProcedureSummary {
  id: string;
  performedAt: string;
  doctor?: { firstName: string; lastName: string };
  notes?: string;
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
  performedProcedures?: PerformedProcedureSummary[];
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
  createdAt?: string;
}

export interface CreateTreatmentPlanDto {
  patientId: string;
  doctorId: string;
  observations?: string;
  items?: { treatmentId: string; tooth?: string; notes?: string; order?: number }[];
}

export const PLAN_STATUS_CONFIG: Record<TreatmentPlanStatus, { label: string; className: string }> = {
  [TreatmentPlanStatus.PENDING]: {
    label: 'Pendiente',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [TreatmentPlanStatus.IN_PROGRESS]: {
    label: 'En progreso',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  [TreatmentPlanStatus.COMPLETED]: {
    label: 'Completado',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  [TreatmentPlanStatus.CANCELLED]: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export const VALID_PLAN_STATUS_TRANSITIONS: Record<TreatmentPlanStatus, TreatmentPlanStatus[]> = {
  [TreatmentPlanStatus.PENDING]: [
    TreatmentPlanStatus.IN_PROGRESS,
    TreatmentPlanStatus.CANCELLED,
  ],
  [TreatmentPlanStatus.IN_PROGRESS]: [
    TreatmentPlanStatus.COMPLETED,
    TreatmentPlanStatus.CANCELLED,
  ],
  [TreatmentPlanStatus.COMPLETED]: [],
  [TreatmentPlanStatus.CANCELLED]: [],
};
