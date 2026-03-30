import { useQuery } from '@tanstack/react-query';
import { treatmentsApi } from '../../requests/treatments.api';
import type { TreatmentFilters } from '../../types';

export function useTreatmentsList(filters: TreatmentFilters = {}) {
  return useQuery({
    queryKey: ['treatments', 'list', filters],
    queryFn: () => treatmentsApi.getAll(filters),
    staleTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });
}

/** Catálogo para selects (p. ej. procedimientos realizados): activos, hasta 500 ítems. */
export function useTreatmentsForSelect() {
  return useTreatmentsList({ page: 1, limit: 500, isActive: true });
}

export function useTreatmentDetail(id: string) {
  return useQuery({
    queryKey: ['treatments', id],
    queryFn: () => treatmentsApi.getById(id),
    enabled: !!id,
  });
}
