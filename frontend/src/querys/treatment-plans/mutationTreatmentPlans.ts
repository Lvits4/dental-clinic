import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { treatmentPlansApi } from '../../requests/treatment-plans.api';
import type { CreateTreatmentPlanDto } from '../../types';
import { TreatmentPlanStatus } from '../../enums';
import { HttpError } from '../../helpers/http';

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

export const useUpdateTreatmentPlanStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: TreatmentPlanStatus) => treatmentPlansApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', id] });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast.success('Estado actualizado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar estado');
      }
    },
  });
};
