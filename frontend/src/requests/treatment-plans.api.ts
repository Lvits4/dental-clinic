import { http } from '../helpers/http';
import type { TreatmentPlan, CreateTreatmentPlanDto, PaginatedResponse, TreatmentPlanListFilters } from '../types';
import { TreatmentPlanStatus } from '../enums';

export const treatmentPlansApi = {
  getAll(filters: TreatmentPlanListFilters = {}): Promise<PaginatedResponse<TreatmentPlan>> {
    return http.get<PaginatedResponse<TreatmentPlan>>('/treatment-plans', {
      page: filters.page,
      limit: filters.limit,
      patientId: filters.patientId,
      status: filters.status,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<TreatmentPlan> {
    return http.get<TreatmentPlan>(`/treatment-plans/${id}`);
  },

  create(data: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    return http.post<TreatmentPlan>('/treatment-plans', data);
  },

  update(id: string, data: { status?: TreatmentPlanStatus; observations?: string }): Promise<TreatmentPlan> {
    return http.patch<TreatmentPlan>(`/treatment-plans/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return http.delete<void>(`/treatment-plans/${id}`);
  },

  addItem(planId: string, item: { treatmentId: string; tooth?: string; notes?: string; order?: number }): Promise<TreatmentPlan> {
    return http.post<TreatmentPlan>(`/treatment-plans/${planId}/items`, item);
  },

  removeItem(planId: string, itemId: string): Promise<void> {
    return http.delete<void>(`/treatment-plans/${planId}/items/${itemId}`);
  },
};
