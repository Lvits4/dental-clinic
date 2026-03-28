import { http } from '../helpers/http';
import type { PaginatedResponse } from '../types';
import type {
  PerformedProcedure,
  CreatePerformedProcedureDto,
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
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<PerformedProcedure> {
    return http.get<PerformedProcedure>(`/performed-procedures/${id}`);
  },

  create(data: CreatePerformedProcedureDto): Promise<PerformedProcedure> {
    return http.post<PerformedProcedure>('/performed-procedures', data);
  },
};
