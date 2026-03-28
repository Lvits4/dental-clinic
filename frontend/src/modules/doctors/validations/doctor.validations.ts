import type { CreateDoctorDto, DoctorFormErrors } from '../types/doctor.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDoctor(data: CreateDoctorDto): DoctorFormErrors {
  const errors: DoctorFormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'El apellido debe tener al menos 2 caracteres';
  }

  if (!data.specialty.trim()) {
    errors.specialty = 'La especialidad es obligatoria';
  }

  if (!data.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio';
  }

  if (!data.email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Formato de correo inválido';
  }

  if (!data.licenseNumber.trim()) {
    errors.licenseNumber = 'El número de licencia es obligatorio';
  }

  return errors;
}
