import { useQuery } from '@tanstack/react-query';
import { treatmentPlansApi } from '../../requests/treatment-plans.api';
import type { TreatmentPlan, TreatmentPlanListFilters } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

export const useTreatmentPlansList = (filters: TreatmentPlanListFilters = {}) => {
  return useQuery({
    queryKey: ['treatment-plans', 'list', filters],
    queryFn: () => treatmentPlansApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
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
    queryFn: async () => {
      const limit = 100;
      const acc: TreatmentPlan[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const res = await treatmentPlansApi.getAll({
          patientId,
          page,
          limit,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
        acc.push(...res.data);
        totalPages = res.meta.totalPages;
        page += 1;
      } while (page <= totalPages);
      return acc;
    },
    enabled: !!patientId,
    select: (plans) =>
      plans.filter(
        (p) =>
          p.status !== TreatmentPlanStatus.CANCELLED && p.status !== TreatmentPlanStatus.COMPLETED,
      ),
  });
};
