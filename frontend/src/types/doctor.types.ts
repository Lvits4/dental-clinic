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
export type UpdateDoctorDto = Partial<CreateDoctorDto> & { isActive?: boolean };

// Filtros (listado paginado en API)
export interface DoctorFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: DoctorSortBy;
  sortOrder?: DoctorSortOrder;
}

export type DoctorSortBy =
  | 'name'
  | 'specialty'
  | 'phone'
  | 'email'
  | 'licenseNumber'
  | 'isActive';

export type DoctorSortOrder = 'asc' | 'desc';

// Errores del formulario
export interface DoctorFormErrors {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
}
