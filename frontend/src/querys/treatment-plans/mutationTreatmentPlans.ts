import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { treatmentPlansApi } from '../../requests/treatment-plans.api';
import type { CreateTreatmentPlanDto } from '../../types';
import { TreatmentPlanStatus } from '../../enums';
import { HttpError } from '../../helpers/http';

export const useCreateTreatmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTreatmentPlanDto) => treatmentPlansApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast.success('Plan de tratamiento creado');
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

export const useUpdateTreatmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { observations?: string } }) =>
      treatmentPlansApi.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', id] });
      toast.success('Plan actualizado exitosamente');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar el plan');
      }
    },
  });
};

export const useDeleteTreatmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => treatmentPlansApi.delete(id),
    onSuccess: (_void, id) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      queryClient.removeQueries({ queryKey: ['treatment-plans', id] });
      toast.success('Plan eliminado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al eliminar el plan');
      }
    },
  });
};
