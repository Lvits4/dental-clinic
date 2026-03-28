import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { treatmentsApi } from '../requests/treatments.api';
import { HttpError } from '../../../common/utils/http';

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
