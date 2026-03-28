import { http } from '../../../shared/utils/http';
import type {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorFilters,
} from '../types/doctor.types';

export const doctorsApi = {
  getAll(filters: DoctorFilters = {}): Promise<Doctor[]> {
    return http.get<Doctor[]>('/doctors', {
      isActive: filters.isActive !== undefined ? String(filters.isActive) : undefined,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<Doctor> {
    return http.get<Doctor>(`/doctors/${id}`);
  },

  create(data: CreateDoctorDto): Promise<Doctor> {
    return http.post<Doctor>('/doctors', data);
  },

  update(id: string, data: UpdateDoctorDto): Promise<Doctor> {
    return http.patch<Doctor>(`/doctors/${id}`, data);
  },

  deactivate(id: string): Promise<Doctor> {
    return http.delete<Doctor>(`/doctors/${id}`);
  },
};
