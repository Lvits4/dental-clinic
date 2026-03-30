import { http } from '../helpers/http';
import type { PaginatedResponse } from '../types';
import type {
  Treatment,
  CreateTreatmentDto,
  UpdateTreatmentDto,
  TreatmentFilters,
} from '../types';

export const treatmentsApi = {
  getAll(filters: TreatmentFilters = {}): Promise<PaginatedResponse<Treatment>> {
    const params: Record<string, string | number | undefined> = {
      page: filters.page,
      limit: filters.limit,
      name: filters.name,
      category: filters.category,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    if (filters.isActive === true || filters.isActive === false) {
      params.isActive = String(filters.isActive);
    }
    return http.get<PaginatedResponse<Treatment>>('/treatments', params);
  },

  getById(id: string): Promise<Treatment> {
    return http.get<Treatment>(`/treatments/${id}`);
  },

  create(data: CreateTreatmentDto): Promise<Treatment> {
    return http.post<Treatment>('/treatments', data);
  },

  update(id: string, data: UpdateTreatmentDto): Promise<Treatment> {
    return http.patch<Treatment>(`/treatments/${id}`, data);
  },

  toggle(id: string): Promise<Treatment> {
    return http.patch<Treatment>(`/treatments/${id}/toggle`);
  },
};
