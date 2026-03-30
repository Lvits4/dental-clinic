import { useQuery } from '@tanstack/react-query';
import { clinicalEvolutionsApi } from '../../requests/clinical-evolutions.api';
import type { ClinicalEvolutionFilters } from '../../types';

export const useClinicalEvolutionsList = (filters: ClinicalEvolutionFilters = {}) => {
  return useQuery({
    queryKey: ['clinical-evolutions', filters],
    queryFn: () => clinicalEvolutionsApi.getAll(filters),
    enabled: Boolean(filters.recordId),
  });
};

export const useClinicalEvolutionDetail = (id: string) => {
  return useQuery({
    queryKey: ['clinical-evolutions', id],
    queryFn: () => clinicalEvolutionsApi.getById(id),
    enabled: !!id,
  });
};
