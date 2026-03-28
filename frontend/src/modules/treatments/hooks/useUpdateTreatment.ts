import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { treatmentsApi } from '../requests/treatments.api';
import type { UpdateTreatmentDto } from '../types/treatment.types';
import { HttpError } from '../../../common/utils/http';

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
