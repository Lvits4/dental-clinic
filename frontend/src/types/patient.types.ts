// Sexo del paciente
export type PatientSex = 'male' | 'female' | 'other';

// Entidad Paciente
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  sex: PatientSex;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  observations?: string;
  isActive: boolean;
}

// DTO para crear paciente
export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  sex: PatientSex;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  observations?: string;
}

// DTO para actualizar paciente (todos los campos opcionales)
export type UpdatePatientDto = Partial<CreatePatientDto> & {
  isActive?: boolean;
};

// Filtros para listado
export interface PatientFilters {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

// Errores del formulario
export interface PatientFormErrors {
  firstName?: string;
  lastName?: string;
  sex?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
}

// Opciones de sexo para el select
export const SEX_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
];
