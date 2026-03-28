import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { doctorsApi } from '../services/doctors.api';
import { HttpError } from '../../../shared/utils/http';

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor desactivado exitosamente');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al desactivar el doctor');
      }
    },
  });
}
