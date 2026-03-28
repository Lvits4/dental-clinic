import { http } from '../helpers/http';
import type {
  ClinicalRecord,
  CreateClinicalRecordDto,
  UpdateClinicalRecordDto,
} from '../types';

export const clinicalRecordsApi = {
  getByPatientOrId(id: string): Promise<ClinicalRecord> {
    return http.get<ClinicalRecord>(`/clinical-records/${id}`);
  },

  create(data: CreateClinicalRecordDto): Promise<ClinicalRecord> {
    return http.post<ClinicalRecord>('/clinical-records', data);
  },

  update(id: string, data: UpdateClinicalRecordDto): Promise<ClinicalRecord> {
    return http.patch<ClinicalRecord>(`/clinical-records/${id}`, data);
  },
};
