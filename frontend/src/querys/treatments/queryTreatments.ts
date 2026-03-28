import { useQuery } from '@tanstack/react-query';
import { treatmentsApi } from '../../requests/treatments.api';

export function useTreatmentsList() {
  return useQuery({
    queryKey: ['treatments'],
    queryFn: () => treatmentsApi.getAll(),
  });
}

export function useTreatmentDetail(id: string) {
  return useQuery({
    queryKey: ['treatments', id],
    queryFn: () => treatmentsApi.getById(id),
    enabled: !!id,
  });
}
