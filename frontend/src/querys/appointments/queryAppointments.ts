import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { appointmentsApi } from '../../requests/appointments.api';
import type { AppointmentFilters } from '../../types';

export function useAppointmentsList(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentsApi.getAll(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAppointmentDetail(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useAppointmentsAgenda(params: {
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['appointments', 'agenda', params.dateFrom, params.dateTo, params.doctorId],
    queryFn: () => appointmentsApi.getAgenda(params),
  });
}
