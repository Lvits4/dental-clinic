import { http } from '../helpers/http';
import type {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorFilters,
  PaginatedResponse,
} from '../types';

export const doctorsApi = {
  getAll(filters: DoctorFilters = {}): Promise<PaginatedResponse<Doctor>> {
    return http.get<PaginatedResponse<Doctor>>('/doctors', {
      page: filters.page,
      limit: filters.limit,
      isActive: filters.isActive !== undefined ? String(filters.isActive) : undefined,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
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

  activate(id: string): Promise<Doctor> {
    return http.patch<Doctor>(`/doctors/${id}`, { isActive: true });
  },
};
