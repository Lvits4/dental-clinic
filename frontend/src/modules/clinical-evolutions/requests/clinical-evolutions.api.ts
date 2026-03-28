import { http } from '../../../common/utils/http';
import type { PaginatedResponse } from '../../../common/types/common';
import type { ClinicalEvolution, CreateClinicalEvolutionDto, ClinicalEvolutionFilters } from '../types/clinical-evolution.types';

export const clinicalEvolutionsApi = {
  getAll(filters: ClinicalEvolutionFilters = {}): Promise<PaginatedResponse<ClinicalEvolution>> {
    return http.get<PaginatedResponse<ClinicalEvolution>>('/clinical-evolutions', {
      page: filters.page,
      limit: filters.limit,
      recordId: filters.recordId,
      doctorId: filters.doctorId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<ClinicalEvolution> {
    return http.get<ClinicalEvolution>(`/clinical-evolutions/${id}`);
  },

  create(data: CreateClinicalEvolutionDto): Promise<ClinicalEvolution> {
    return http.post<ClinicalEvolution>('/clinical-evolutions', data);
  },
};
