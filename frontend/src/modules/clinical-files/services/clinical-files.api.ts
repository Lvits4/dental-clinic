import { http, fetchDefault } from '../../../shared/utils/http';
import type { PaginatedResponse } from '../../../shared/types/common';
import type { ClinicalFile, ClinicalFileFilters } from '../types/clinical-file.types';

export const clinicalFilesApi = {
  getAll(filters: ClinicalFileFilters = {}): Promise<PaginatedResponse<ClinicalFile>> {
    return http.get<PaginatedResponse<ClinicalFile>>('/clinical-files', {
      page: filters.page,
      limit: filters.limit,
      patientId: filters.patientId,
    } as Record<string, string | number | undefined>);
  },

  upload(patientId: string, file: File, clinicalEvolutionId?: string): Promise<ClinicalFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    if (clinicalEvolutionId) formData.append('clinicalEvolutionId', clinicalEvolutionId);
    return fetchDefault<ClinicalFile>('/clinical-files/upload', {
      method: 'POST',
      body: formData,
    });
  },

  delete(id: string): Promise<void> {
    return http.delete<void>(`/clinical-files/${id}`);
  },
};
