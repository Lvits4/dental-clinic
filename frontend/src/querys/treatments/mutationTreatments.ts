import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { treatmentsApi } from '../../requests/treatments.api';
import type { CreateTreatmentDto, UpdateTreatmentDto } from '../../types';
import { HttpError } from '../../helpers/http';

export function useCreateTreatment() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTreatmentDto) => treatmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('Tratamiento creado exitosamente');
      navigate('/treatments');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al crear el tratamiento');
      }
    },
  });
}

export function useUpdateTreatment(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateTreatmentDto) => treatmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('Tratamiento actualizado');
      navigate('/treatments');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar el tratamiento');
      }
    },
  });
}

export function useToggleTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => treatmentsApi.toggle(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success(data.isActive ? 'Tratamiento activado' : 'Tratamiento desactivado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al cambiar estado del tratamiento');
      }
    },
  });
}
