import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../requests/patients.api';

export const usePatientDetail = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
};
