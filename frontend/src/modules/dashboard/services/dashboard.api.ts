import { http } from '../../../shared/utils/http';

export interface DashboardSummary {
  todayAppointments: number;
  attendedToday: number;
  newPatients: number;
  treatmentsInProgress: number;
  treatmentsCompleted: number;
  cancelledLast30Days: number;
}

export interface StatusCount {
  status: string;
  count: string;
}

export interface DoctorWorkload {
  doctorId: string;
  doctorName: string;
  appointmentCount: string;
}

export interface RecentActivity {
  id: string;
  patient: string;
  doctor: string;
  status: string;
  dateTime: string;
  createdAt: string;
}

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
