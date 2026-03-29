import { PageHeader, Spinner } from '../components/ui';
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
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500',
  CONFIRMED: 'bg-emerald-500',
  IN_PROGRESS: 'bg-amber-500',
  ATTENDED: 'bg-teal-500',
  CANCELLED: 'bg-red-500',
  NO_SHOW: 'bg-slate-400',
  pending: 'bg-amber-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-teal-500',
  cancelled: 'bg-red-500',
};

const BAR_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500',
  CONFIRMED: 'bg-emerald-500',
  IN_PROGRESS: 'bg-amber-500',
  ATTENDED: 'bg-teal-500',
  CANCELLED: 'bg-red-500',
  NO_SHOW: 'bg-slate-400',
};

/** Mismo radio que enlaces del sidebar (`rounded-lg`) */
const PANEL =
  'bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex flex-col min-h-0';

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconClipboard = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const IconX = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RECENT_ACTIVITY_LIMIT = 6;

const DashboardView = () => {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: appointmentsByStatus } = useAppointmentsByStatus();
  const { data: doctorWorkload } = useDoctorWorkload();
  const { data: recentActivity } = useRecentActivity();

  if (summaryLoading) {
    return (
      <div className="flex flex-col min-h-0">
        <PageHeader
          title="Dashboard"
          subtitle="Resumen de actividad de la clinica"
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Dashboard' }]}
          dense
        />
        <div className="flex flex-1 justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  const s = summary?.data;

  const statCards = s
    ? [
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
      ]
    : [];

  return (
    <div
      className="flex flex-col min-h-0 gap-4 lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden"
      aria-label="Dashboard de la clinica"
    >
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de actividad de la clinica"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Dashboard' }]}
        dense
      />

      {/* Fila de KPI: ancho completo del contenedor, 6 columnas */}
      <div className="shrink-0 w-full min-w-0 stagger-fade">
        <div className="grid w-full grid-cols-6 gap-2 min-w-0">
          {statCards.map((card) => (
            <div key={card.title} className="min-w-0">
              <StatCard
                title={card.title}
                value={card.value}
                color={card.color}
                icon={card.icon}
                compact
                stacked
              />
            </div>
          ))}
        </div>
      </div>

      {/* Citas + carga (izq.) | Actividad (der.) */}
      <div className="min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch lg:flex-1">
        <div className="flex flex-col gap-4 min-h-0 min-w-0 lg:flex-1">
          <div className={`${PANEL} lg:flex-1 lg:min-h-0`}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight mb-3 shrink-0">
              Citas por Estado
            </h3>
            {appointmentsByStatus?.data?.length ? (
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5">
                {appointmentsByStatus.data.map((item) => {
                  const total = appointmentsByStatus.data.reduce(
                    (acc, i) => acc + Number(i.count),
                    0,
                  );
                  const pct = total > 0 ? (Number(item.count) / total) * 100 : 0;
                  const barColor = BAR_COLORS[item.status] || 'bg-slate-400';
                  return (
                    <div key={item.status} className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 w-[5.5rem] shrink-0 truncate">
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg h-2 overflow-hidden min-w-0">
                        <div
                          className={`${barColor} h-2 rounded-lg transition-all duration-500 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 w-7 text-right tabular-nums shrink-0">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Sin datos</p>
            )}
          </div>

          <div className={`${PANEL} lg:flex-1 lg:min-h-0`}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight mb-3 shrink-0">
              Carga de Trabajo Hoy
            </h3>
            {doctorWorkload?.data?.length ? (
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                {doctorWorkload.data.map((doc) => (
                  <div
                    key={doc.doctorId}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {doc.doctorName?.charAt(0)?.toUpperCase() ?? 'D'}
                      </div>
                      <span className="text-xs font-medium text-slate-800 dark:text-white truncate">
                        Dr. {doc.doctorName}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                      {doc.appointmentCount} citas
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Sin citas hoy</p>
            )}
          </div>
        </div>

        <div className={`${PANEL} min-h-0 h-full min-w-0`}>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight mb-3 shrink-0">
            Actividad Reciente
          </h3>
          {recentActivity?.data?.length ? (
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5">
              {recentActivity.data.slice(0, RECENT_ACTIVITY_LIMIT).map((act) => (
                <div
                  key={act.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-lg shrink-0 ${STATUS_COLORS[act.status] || 'bg-slate-400'}`} />
                    <span className="text-xs font-medium text-slate-800 dark:text-white truncate">
                      {act.patient}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline truncate">
                      — Dr. {act.doctor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-3 sm:pl-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {formatDateTime(act.dateTime)}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-200/60 dark:ring-slate-600/40 whitespace-nowrap">
                      {STATUS_LABELS[act.status] || act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Sin actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
