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
