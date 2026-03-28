import { Spinner } from '../components/ui';
import StatCard from '../components/dashboard/StatCard';
import {
  useDashboardSummary,
  useAppointmentsByStatus,
  useDoctorWorkload,
  useRecentActivity,
} from '../querys/dashboard/queryDashboard';

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Programada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En curso',
  ATTENDED: 'Atendida',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No asistio',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  COMPLETED: 'Completado',
};

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Iconos inline
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconClipboard = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const IconX = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DashboardView = () => {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: appointmentsByStatus } = useAppointmentsByStatus();
  const { data: doctorWorkload } = useDoctorWorkload();
  const { data: recentActivity } = useRecentActivity();

  if (summaryLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const s = summary?.data;

  const statCards = s ? [
    {
      title: 'Citas de Hoy',
      value: s.todayAppointments,
      color: 'blue' as const,
      icon: <IconCalendar />,
    },
    {
      title: 'Atendidos Hoy',
      value: s.attendedToday,
      color: 'emerald' as const,
      icon: <IconCheck />,
    },
    {
      title: 'Pacientes Nuevos (30d)',
      value: s.newPatients,
      color: 'purple' as const,
      icon: <IconUsers />,
    },
    {
      title: 'Tratamientos en Proceso',
      value: s.treatmentsInProgress,
      color: 'yellow' as const,
      icon: <IconClipboard />,
    },
    {
      title: 'Tratamientos Terminados',
      value: s.treatmentsCompleted,
      color: 'gray' as const,
      icon: <IconClipboard />,
    },
    {
      title: 'Cancelaciones (30d)',
      value: s.cancelledLast30Days,
      color: 'red' as const,
      icon: <IconX />,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stat Cards - 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Citas por estado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Citas por Estado
          </h3>
          {appointmentsByStatus?.data?.length ? (
            <div className="space-y-3">
              {appointmentsByStatus.data.map((item) => {
                const total = appointmentsByStatus.data.reduce(
                  (acc, i) => acc + Number(i.count),
                  0,
                );
                const pct = total > 0 ? (Number(item.count) / total) * 100 : 0;
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0">
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">
                      {item.count}
                    </span>
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
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Carga de Trabajo Hoy
          </h3>
          {doctorWorkload?.data?.length ? (
            <div className="space-y-2">
              {doctorWorkload.data.map((doc) => (
                <div
                  key={doc.doctorId}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <span className="text-sm text-gray-900 dark:text-white">
                    Dr. {doc.doctorName}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {doc.appointmentCount} citas
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Sin citas hoy</p>
          )}
        </div>
      </div>

      {/* Actividad reciente - cards en mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        {recentActivity?.data?.length ? (
          <div className="space-y-2">
            {recentActivity.data.slice(0, 10).map((act) => (
              <div
                key={act.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {act.patient}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    — Dr. {act.doctor}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(act.dateTime)}
                  </span>
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
};

export default DashboardView;
