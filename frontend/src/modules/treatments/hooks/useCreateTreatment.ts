import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { treatmentsApi } from '../services/treatments.api';
import type { CreateTreatmentDto } from '../types/treatment.types';
import { HttpError } from '../../../shared/utils/http';

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
