import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';
import Spinner from '../../../shared/components/feedback/Spinner';

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Programada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En curso',
  ATTENDED: 'Atendida',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No asistió',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  COMPLETED: 'Completado',
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DashboardView() {
  const { data: summary, isLoading: ls } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
  });
  const { data: appointmentsByStatus } = useQuery({
    queryKey: ['dashboard', 'appointments-by-status'],
    queryFn: () => dashboardApi.getAppointmentsByStatus(),
  });
  const { data: doctorWorkload } = useQuery({
    queryKey: ['dashboard', 'doctor-workload'],
    queryFn: () => dashboardApi.getDoctorWorkload(),
  });
  const { data: recentActivity } = useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => dashboardApi.getRecentActivity(),
  });

  if (ls) return <div className="flex justify-center py-12"><Spinner /></div>;

  const s = summary?.data;
  const stats = s ? [
    { label: 'Citas de Hoy', value: s.todayAppointments, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Atendidos Hoy', value: s.attendedToday, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Pacientes Nuevos (30d)', value: s.newPatients, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Tratamientos en Proceso', value: s.treatmentsInProgress, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Tratamientos Terminados', value: s.treatmentsCompleted, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-700/20' },
    { label: 'Cancelaciones (30d)', value: s.cancelledLast30Days, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  ] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Citas por estado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Citas por Estado</h3>
          {appointmentsByStatus?.data?.length ? (
            <div className="space-y-2">
              {appointmentsByStatus.data.map((item) => {
                const total = appointmentsByStatus.data.reduce((acc, i) => acc + Number(i.count), 0);
                const pct = total > 0 ? (Number(item.count) / total) * 100 : 0;
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0">
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">{item.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos</p>
          )}
        </div>

        {/* Carga de doctores */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Carga de Trabajo Hoy</h3>
          {doctorWorkload?.data?.length ? (
            <div className="space-y-2">
              {doctorWorkload.data.map((doc) => (
                <div key={doc.doctorId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-900 dark:text-white">Dr. {doc.doctorName}</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{doc.appointmentCount} citas</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Sin citas hoy</p>
          )}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Actividad Reciente</h3>
        {recentActivity?.data?.length ? (
          <div className="space-y-2">
            {recentActivity.data.slice(0, 10).map((act) => (
              <div key={act.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div>
                  <span className="text-sm text-gray-900 dark:text-white">{act.patient}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">— Dr. {act.doctor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(act.dateTime)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                    {STATUS_LABELS[act.status] || act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Sin actividad reciente</p>
        )}
      </div>
    </div>
  );
}
