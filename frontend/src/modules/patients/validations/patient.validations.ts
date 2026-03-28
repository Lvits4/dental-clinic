import type { CreatePatientDto, PatientFormErrors } from '../types/patient.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()-]{7,20}$/;

export function validatePatient(data: CreatePatientDto): PatientFormErrors {
  const errors: PatientFormErrors = {};

  // Nombre
  if (!data.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'El nombre debe tener al menos 2 caracteres';
  }

  // Apellido
  if (!data.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'El apellido debe tener al menos 2 caracteres';
  }

  // Sexo
  if (!data.sex) {
    errors.sex = 'El sexo es obligatorio';
  }

  // Fecha de nacimiento
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'La fecha de nacimiento es obligatoria';
  } else {
    const date = new Date(data.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = 'Fecha inválida';
    } else if (date > new Date()) {
      errors.dateOfBirth = 'La fecha no puede ser futura';
    }
  }

  // Teléfono
  if (!data.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio';
  } else if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = 'Formato de teléfono inválido';
  }

  // Email (opcional pero si se ingresa, debe ser válido)
  if (data.email && data.email.trim() && !EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Formato de correo inválido';
  }

  return errors;
}
