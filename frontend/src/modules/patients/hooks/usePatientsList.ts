import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../services/patients.api';
import type { PatientFilters } from '../types/patient.types';

export function usePatientsList(filters: PatientFilters = {}) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientsApi.getAll(filters),
  });
}
