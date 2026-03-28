import { useQuery } from '@tanstack/react-query';
import { clinicalRecordsApi } from '../../requests/clinical-records.api';

export const useClinicalRecord = (patientId: string) => {
  return useQuery({
    queryKey: ['clinical-records', patientId],
    queryFn: () => clinicalRecordsApi.getByPatientOrId(patientId),
    enabled: !!patientId,
    retry: false,
  });
};
