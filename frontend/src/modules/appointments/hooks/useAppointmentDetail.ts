import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../requests/appointments.api';

export function useAppointmentDetail(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentsApi.getById(id),
    enabled: !!id,
  });
}
