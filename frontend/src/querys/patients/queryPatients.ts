import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../../requests/patients.api';
import type { PatientFilters } from '../../types';

export const usePatientsList = (filters: PatientFilters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientsApi.getAll(filters),
    staleTime: 1000 * 60 * 10, // 10 min — lookup data changes rarely
  });
};

export const usePatientDetail = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
};
