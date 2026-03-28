import { http } from '../../../common/utils/http';
import type { Treatment, CreateTreatmentDto, UpdateTreatmentDto } from '../types/treatment.types';

export const treatmentsApi = {
  getAll(): Promise<Treatment[]> {
    return http.get<Treatment[]>('/treatments');
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
