import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../requests/appointments.api';
import type { AppointmentFilters } from '../types/appointment.types';

export function useAppointmentsList(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentsApi.getAll(filters),
  });
}
