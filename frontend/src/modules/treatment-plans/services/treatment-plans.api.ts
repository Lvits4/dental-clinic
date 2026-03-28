import { http } from '../../../shared/utils/http';
import type { TreatmentPlan, CreateTreatmentPlanDto, TreatmentPlanStatus } from '../types/treatment-plan.types';

export const treatmentPlansApi = {
  getAll(): Promise<TreatmentPlan[]> {
    return http.get<TreatmentPlan[]>('/treatment-plans');
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

  addItem(planId: string, item: { treatmentId: string; tooth?: string; notes?: string; order?: number }): Promise<TreatmentPlan> {
    return http.post<TreatmentPlan>(`/treatment-plans/${planId}/items`, item);
  },

  removeItem(planId: string, itemId: string): Promise<void> {
    return http.delete<void>(`/treatment-plans/${planId}/items/${itemId}`);
  },
};
