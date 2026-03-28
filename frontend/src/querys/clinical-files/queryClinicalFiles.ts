import { useQuery } from '@tanstack/react-query';
import { clinicalFilesApi } from '../../requests/clinical-files.api';
import type { ClinicalFileFilters } from '../../types';

export const useClinicalFilesList = (filters: ClinicalFileFilters = {}) => {
  return useQuery({
    queryKey: ['clinical-files', filters],
    queryFn: () => clinicalFilesApi.getAll(filters),
  });
};
