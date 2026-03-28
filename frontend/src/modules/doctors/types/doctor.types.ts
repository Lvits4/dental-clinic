// Entidad Doctor
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  email: string;
  licenseNumber: string;
  isActive: boolean;
}

// DTO para crear doctor
export interface CreateDoctorDto {
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  email: string;
  licenseNumber: string;
}

// DTO para actualizar doctor
export type UpdateDoctorDto = Partial<CreateDoctorDto>;

// Filtros
export interface DoctorFilters {
  isActive?: boolean;
}

// Errores del formulario
export interface DoctorFormErrors {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
}
