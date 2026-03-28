import { http } from '../helpers/http';
import type { PaginatedResponse } from '../types';
import type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  UpdateStatusDto,
  RescheduleAppointmentDto,
  AppointmentFilters,
} from '../types';

export const appointmentsApi = {
  getAll(filters: AppointmentFilters = {}): Promise<PaginatedResponse<Appointment>> {
    return http.get<PaginatedResponse<Appointment>>('/appointments', {
      page: filters.page,
      limit: filters.limit,
      doctorId: filters.doctorId,
      patientId: filters.patientId,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<Appointment> {
    return http.get<Appointment>(`/appointments/${id}`);
  },

  getAgenda(params: { doctorId?: string; dateFrom?: string; dateTo?: string } = {}): Promise<Appointment[]> {
    return http.get<Appointment[]>('/appointments/agenda', params as Record<string, string | number | undefined>);
  },

  create(data: CreateAppointmentDto): Promise<Appointment> {
    return http.post<Appointment>('/appointments', data);
  },

  update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    return http.patch<Appointment>(`/appointments/${id}`, data);
  },

  updateStatus(id: string, data: UpdateStatusDto): Promise<Appointment> {
    return http.patch<Appointment>(`/appointments/${id}/status`, data);
  },

  reschedule(id: string, data: RescheduleAppointmentDto): Promise<Appointment> {
    return http.patch<Appointment>(`/appointments/${id}/reschedule`, data);
  },

  cancel(id: string): Promise<void> {
    return http.delete<void>(`/appointments/${id}`);
  },
};
