import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentsApi } from '../requests/appointments.api';
import type { AppointmentStatus } from '../types/appointment.types';
import { STATUS_CONFIG } from '../types/appointment.types';
import { HttpError } from '../../../common/utils/http';

export function useUpdateAppointmentStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: AppointmentStatus) => appointmentsApi.updateStatus(id, { status }),
    onSuccess: (_data, status) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', id] });
      toast.success(`Estado cambiado a: ${STATUS_CONFIG[status].label}`);
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al cambiar el estado');
      }
    },
  });
}
