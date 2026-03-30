import { http } from '../helpers/http';
import type { PaginatedResponse } from '../types';
import type {
  PerformedProcedure,
  CreatePerformedProcedureDto,
  UpdatePerformedProcedureDto,
  PerformedProcedureFilters,
} from '../types';

export const performedProceduresApi = {
  getAll(filters: PerformedProcedureFilters = {}): Promise<PaginatedResponse<PerformedProcedure>> {
    return http.get<PaginatedResponse<PerformedProcedure>>('/performed-procedures', {
      page: filters.page,
      limit: filters.limit,
      patientId: filters.patientId,
      doctorId: filters.doctorId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<PerformedProcedure> {
    return http.get<PerformedProcedure>(`/performed-procedures/${id}`);
  },

  create(data: CreatePerformedProcedureDto): Promise<PerformedProcedure> {
    return http.post<PerformedProcedure>('/performed-procedures', data);
  },

  update(id: string, data: UpdatePerformedProcedureDto): Promise<PerformedProcedure> {
    return http.patch<PerformedProcedure>(`/performed-procedures/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return http.delete<void>(`/performed-procedures/${id}`);
  },
};
