import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../requests/patients.api';
import type { PatientFilters } from '../types/patient.types';

export const usePatientsList = (filters: PatientFilters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientsApi.getAll(filters),
  });
};
