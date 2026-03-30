import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../../requests/patients.api';
import type { PatientFilters } from '../../types';

export const usePatientsList = (filters: PatientFilters = {}) => {
  const params: PatientFilters = {
    ...filters,
    isActive: filters.isActive ?? true,
  };
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsApi.getAll(params),
    staleTime: 1000 * 60 * 10, // 10 min — lookup data changes rarely
    /** Evita skeleton al cambiar orden/página/filtros: se muestran datos previos hasta la respuesta. */
    placeholderData: (previousData) => previousData,
  });
};

export const usePatientDetail = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
};
