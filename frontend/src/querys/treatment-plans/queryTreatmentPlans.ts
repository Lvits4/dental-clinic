import { useQuery } from '@tanstack/react-query';
import { treatmentPlansApi } from '../../requests/treatment-plans.api';

export const useTreatmentPlansList = () => {
  return useQuery({
    queryKey: ['treatment-plans'],
    queryFn: () => treatmentPlansApi.getAll(),
  });
};

export const useTreatmentPlanDetail = (id: string) => {
  return useQuery({
    queryKey: ['treatment-plans', id],
    queryFn: () => treatmentPlansApi.getById(id),
    enabled: !!id,
  });
};

export const useTreatmentPlansByPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['treatment-plans', 'by-patient', patientId],
    queryFn: () => treatmentPlansApi.getAll(),
    select: (plans) =>
      plans.filter(
        (p) =>
          p.patientId === patientId &&
          p.status !== 'cancelled' &&
          p.status !== 'completed',
      ),
    enabled: !!patientId,
  });
};
