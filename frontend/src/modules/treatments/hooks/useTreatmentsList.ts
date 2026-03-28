import { useQuery } from '@tanstack/react-query';
import { treatmentsApi } from '../services/treatments.api';

export function useTreatmentsList() {
  return useQuery({
    queryKey: ['treatments'],
    queryFn: () => treatmentsApi.getAll(),
  });
}
