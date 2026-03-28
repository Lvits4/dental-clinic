import { http } from '../helpers/http';
import type { DashboardSummary, StatusCount, DoctorWorkload, RecentActivity } from '../types';

export const dashboardApi = {
  getSummary(): Promise<{ data: DashboardSummary }> {
    return http.get('/dashboard/summary');
  },

  getAppointmentsByStatus(): Promise<{ data: StatusCount[] }> {
    return http.get('/dashboard/appointments-by-status');
  },

  getDoctorWorkload(): Promise<{ data: DoctorWorkload[] }> {
    return http.get('/dashboard/doctor-workload');
  },

  getTreatmentsSummary(): Promise<{ data: StatusCount[] }> {
    return http.get('/dashboard/treatments-summary');
  },

  getRecentActivity(): Promise<{ data: RecentActivity[] }> {
    return http.get('/dashboard/recent-activity');
  },
};
