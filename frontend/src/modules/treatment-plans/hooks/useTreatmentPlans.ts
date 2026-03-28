import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { treatmentPlansApi } from '../requests/treatment-plans.api';
import type { CreateTreatmentPlanDto } from '../types/treatment-plan.types';
import { HttpError } from '../../../common/utils/http';

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

export const useCreateTreatmentPlan = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTreatmentPlanDto) => treatmentPlansApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast.success('Plan de tratamiento creado');
      navigate('/treatment-plans');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al crear plan');
      }
    },
  });
};
