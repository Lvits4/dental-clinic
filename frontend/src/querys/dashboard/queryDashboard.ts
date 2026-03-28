import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../requests/dashboard.api';
import type { DashboardSummary, StatusCount, DoctorWorkload, RecentActivity } from '../../types';

export const useDashboardSummary = () => {
  return useQuery<{ data: DashboardSummary }>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAppointmentsByStatus = () => {
  return useQuery<{ data: StatusCount[] }>({
    queryKey: ['dashboard', 'appointments-by-status'],
    queryFn: () => dashboardApi.getAppointmentsByStatus(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useDoctorWorkload = () => {
  return useQuery<{ data: DoctorWorkload[] }>({
    queryKey: ['dashboard', 'doctor-workload'],
    queryFn: () => dashboardApi.getDoctorWorkload(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useTreatmentsSummary = () => {
  return useQuery<{ data: StatusCount[] }>({
    queryKey: ['dashboard', 'treatments-summary'],
    queryFn: () => dashboardApi.getTreatmentsSummary(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecentActivity = () => {
  return useQuery<{ data: RecentActivity[] }>({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => dashboardApi.getRecentActivity(),
    staleTime: 2 * 60 * 1000,
  });
};
