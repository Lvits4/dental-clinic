import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { performedProceduresApi } from '../../requests/performed-procedures.api';
import type { PerformedProcedureFilters } from '../../types';

export const usePerformedProceduresList = (filters: PerformedProcedureFilters = {}) => {
  return useQuery({
    queryKey: ['performed-procedures', filters],
    queryFn: () => performedProceduresApi.getAll(filters),
    placeholderData: keepPreviousData, // Keep showing old page while new page loads
  });
};

export const usePerformedProcedureDetail = (id: string) => {
  return useQuery({
    queryKey: ['performed-procedures', id],
    queryFn: () => performedProceduresApi.getById(id),
    enabled: !!id,
  });
};
