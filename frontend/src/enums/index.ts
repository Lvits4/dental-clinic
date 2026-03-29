// Roles del sistema
export const Role = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// Estados de citas
export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  ATTENDED: 'attended',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

// Estados de planes de tratamiento
export const TreatmentPlanStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
export type TreatmentPlanStatus = (typeof TreatmentPlanStatus)[keyof typeof TreatmentPlanStatus];
