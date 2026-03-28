import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../services/patients.api';

export function usePatientDetail(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
}
