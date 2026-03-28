import type { CreateAppointmentDto, AppointmentFormErrors } from '../types/appointment.types';

export function validateAppointment(data: CreateAppointmentDto): AppointmentFormErrors {
  const errors: AppointmentFormErrors = {};

  if (!data.patientId) {
    errors.patientId = 'Debe seleccionar un paciente';
  }

  if (!data.doctorId) {
    errors.doctorId = 'Debe seleccionar un doctor';
  }

  if (!data.dateTime) {
    errors.dateTime = 'La fecha y hora son obligatorias';
  } else {
    const date = new Date(data.dateTime);
    if (isNaN(date.getTime())) {
      errors.dateTime = 'Fecha inválida';
    }
  }

  if (data.durationMinutes !== undefined && data.durationMinutes < 15) {
    errors.durationMinutes = 'La duración mínima es 15 minutos';
  }

  return errors;
}
