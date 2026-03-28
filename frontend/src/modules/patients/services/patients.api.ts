import { http } from '../../../shared/utils/http';
import type { PaginatedResponse } from '../../../shared/types/common';
import type {
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  PatientFilters,
} from '../types/patient.types';

export const patientsApi = {
  getAll(filters: PatientFilters = {}): Promise<PaginatedResponse<Patient>> {
    return http.get<PaginatedResponse<Patient>>('/patients', {
      page: filters.page,
      limit: filters.limit,
      name: filters.name,
      phone: filters.phone,
      email: filters.email,
      isActive: filters.isActive !== undefined ? String(filters.isActive) : undefined,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<Patient> {
    return http.get<Patient>(`/patients/${id}`);
  },

  create(data: CreatePatientDto): Promise<Patient> {
    return http.post<Patient>('/patients', data);
  },

  update(id: string, data: UpdatePatientDto): Promise<Patient> {
    return http.patch<Patient>(`/patients/${id}`, data);
  },

  deactivate(id: string): Promise<void> {
    return http.delete<void>(`/patients/${id}`);
  },
};
