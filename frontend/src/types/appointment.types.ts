import type { Patient } from './patient.types';
import type { Doctor } from './doctor.types';
import { AppointmentStatus } from '../enums';

// Entidad Cita
export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: Doctor;
  dateTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
}

// DTO para crear cita
export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  dateTime: string;
  durationMinutes?: number;
  reason?: string;
  notes?: string;
}

// DTO para actualizar cita
export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;

// DTO para cambiar estado
export interface UpdateStatusDto {
  status: AppointmentStatus;
}

// DTO para reprogramar
export interface RescheduleAppointmentDto {
  dateTime: string;
  durationMinutes?: number;
}

// Filtros
export interface AppointmentFilters {
  page?: number;
  limit?: number;
  doctorId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
}

// Errores del formulario
export interface AppointmentFormErrors {
  patientId?: string;
  doctorId?: string;
  dateTime?: string;
  durationMinutes?: string;
}

// Labels y colores de estado
export const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  [AppointmentStatus.SCHEDULED]: {
    label: 'Programada',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [AppointmentStatus.CONFIRMED]: {
    label: 'Confirmada',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  [AppointmentStatus.IN_PROGRESS]: {
    label: 'En curso',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  [AppointmentStatus.ATTENDED]: {
    label: 'Atendida',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-400',
  },
  [AppointmentStatus.CANCELLED]: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  [AppointmentStatus.NO_SHOW]: {
    label: 'No asistió',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
} as Record<AppointmentStatus, { label: string; className: string }>;

// Opciones de estado para selects
export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
  value,
  label,
}));

/**
 * Transiciones validas de estado para citas.
 * Define a que estados se puede pasar desde cada estado actual.
 * CANCELLED, ATTENDED y NO_SHOW son estados finales (sin transiciones).
 */
export const VALID_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  [AppointmentStatus.SCHEDULED]: [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.IN_PROGRESS,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.CONFIRMED]: [
    AppointmentStatus.IN_PROGRESS,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.IN_PROGRESS]: [
    AppointmentStatus.ATTENDED,
    AppointmentStatus.NO_SHOW,
  ],
  // Estados finales — no se puede transicionar a nada
  [AppointmentStatus.ATTENDED]: [],
  [AppointmentStatus.CANCELLED]: [],
  [AppointmentStatus.NO_SHOW]: [],
};

// Opciones de duración
export const DURATION_OPTIONS = [
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1.5 horas' },
  { value: '120', label: '2 horas' },
];
