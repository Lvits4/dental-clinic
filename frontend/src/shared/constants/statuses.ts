import type { SelectOption } from '../types/common';

// Estados de citas
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Programada',
  [AppointmentStatus.CONFIRMED]: 'Confirmada',
  [AppointmentStatus.IN_PROGRESS]: 'En curso',
  [AppointmentStatus.ATTENDED]: 'Atendida',
  [AppointmentStatus.CANCELLED]: 'Cancelada',
  [AppointmentStatus.NO_SHOW]: 'No asistió',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [AppointmentStatus.CONFIRMED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  [AppointmentStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [AppointmentStatus.ATTENDED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [AppointmentStatus.NO_SHOW]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export const APPOINTMENT_STATUS_OPTIONS: SelectOption[] = Object.values(AppointmentStatus).map(
  (status) => ({
    value: status,
    label: APPOINTMENT_STATUS_LABELS[status],
  }),
);

// Estados de planes de tratamiento
export enum TreatmentPlanStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const TREATMENT_PLAN_STATUS_LABELS: Record<TreatmentPlanStatus, string> = {
  [TreatmentPlanStatus.PENDING]: 'Pendiente',
  [TreatmentPlanStatus.IN_PROGRESS]: 'En progreso',
  [TreatmentPlanStatus.COMPLETED]: 'Completado',
  [TreatmentPlanStatus.CANCELLED]: 'Cancelado',
};

export const TREATMENT_PLAN_STATUS_COLORS: Record<TreatmentPlanStatus, string> = {
  [TreatmentPlanStatus.PENDING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [TreatmentPlanStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [TreatmentPlanStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  [TreatmentPlanStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
