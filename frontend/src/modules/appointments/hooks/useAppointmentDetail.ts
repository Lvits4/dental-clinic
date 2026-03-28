import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../services/appointments.api';

export function useAppointmentDetail(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentsApi.getById(id),
    enabled: !!id,
  });
}
