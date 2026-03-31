import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AppointmentModalLocationState } from './AppointmentRouteRedirects';
import { PageHeader, Button, Select, Spinner } from '../../components/ui';
import AppointmentStatusBadge from '../../components/appointments/AppointmentStatusBadge';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
import { useAppointmentsAgenda } from '../../querys/appointments/queryAppointments';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import type { Appointment } from '../../types';

function getWeekRange(date: Date): { from: string; to: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toISOString().split('T')[0],
    to: sunday.toISOString().split('T')[0],
  };
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' });
}

const AppointmentAgendaView = () => {
  const [baseDate, setBaseDate] = useState(new Date());
  const [doctorId, setDoctorId] = useState('');
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);

  const { from, to } = useMemo(() => getWeekRange(baseDate), [baseDate]);

  const { data: appointments, isLoading } = useAppointmentsAgenda({
    dateFrom: from,
    dateTo: to,
    doctorId: doctorId || undefined,
  });

  const { data: doctors } = useDoctorsList();

  const doctorOptions = (doctors || []).map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName}`,
  }));

  const groupedByDay = useMemo(() => {
    if (!appointments) return {};
    const grouped: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      const day = a.dateTime.split('T')[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(a);
    });
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
    );
    return grouped;
  }, [appointments]);

  const weekDays = useMemo(() => {
    const days: string[] = [];
    const start = new Date(from);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, [from]);

  const navigateWeek = (offset: number) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset * 7);
    setBaseDate(d);
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Agenda"
          subtitle="Vista semanal de citas"
          breadcrumb={[
            { label: 'Inicio', to: '/' },
            { label: 'Citas', to: '/appointments' },
            { label: 'Agenda' },
          ]}
          action={
            <Link
              className="block w-full sm:inline-block sm:w-auto"
              to="/appointments"
              state={{ openAppointmentModal: 'create' } satisfies AppointmentModalLocationState}
            >
              <Button className="h-10 min-h-10 w-full shrink-0 rounded-md py-0! px-4 whitespace-nowrap sm:w-auto">
                <svg className="mr-1.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva cita
              </Button>
            </Link>
          }
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 space-y-4">

      {/* Controles de navegación */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-2 min-w-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigateWeek(-1)}
            className="shrink-0 p-1.5 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="min-w-0 flex-1 basis-[min(100%,12rem)] sm:flex-initial sm:basis-auto text-center text-xs font-medium text-slate-700 dark:text-slate-300 sm:text-sm px-1 leading-snug">
            <span className="block sm:inline">
              {new Date(from).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
            </span>
            <span className="sm:mx-1"> — </span>
            <span className="block sm:inline">
              {new Date(to).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </span>
          <button
            type="button"
            onClick={() => navigateWeek(1)}
            className="shrink-0 p-1.5 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setBaseDate(new Date())}
            className="shrink-0 px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Hoy
          </button>
        </div>
        <div className="w-full sm:w-56">
          <Select
            options={doctorOptions}
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            placeholder="Todos los doctores"
          />
        </div>
      </div>

      {/* Vista — lista vertical en mobile, grid semanal en desktop */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Mobile: lista vertical por dia */}
          <div className="md:hidden space-y-3">
            {weekDays.map((day) => {
              const isToday = day === new Date().toISOString().split('T')[0];
              const dayAppointments = groupedByDay[day] || [];
              if (dayAppointments.length === 0) return null;

              return (
                <div key={day}>
                  <h3 className={`text-xs font-semibold mb-1.5 capitalize ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {formatDateShort(day)}
                    {isToday && <span className="ml-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">Hoy</span>}
                  </h3>
                  <div className="space-y-1.5">
                    {dayAppointments.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setEditAppointment(a)}
                        className="w-full flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {formatTime(a.dateTime)} — {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Paciente'}
                          </div>
                          {a.doctor && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Dr. {a.doctor.firstName} {a.doctor.lastName}
                            </div>
                          )}
                        </div>
                        <AppointmentStatusBadge status={a.status} />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {weekDays.every((day) => (groupedByDay[day] || []).length === 0) && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">Sin citas esta semana</p>
            )}
          </div>

          {/* Desktop: grid semanal */}
          <div className="hidden md:grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isToday = day === new Date().toISOString().split('T')[0];
              const dayAppointments = groupedByDay[day] || [];

              return (
                <div
                  key={day}
                  className={`bg-white dark:bg-slate-800 rounded-md border p-3 min-h-32
                    ${isToday
                      ? 'border-emerald-400 dark:border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <h3 className={`text-xs font-semibold mb-2 capitalize ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {formatDateShort(day)}
                  </h3>
                  {dayAppointments.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500">Sin citas</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dayAppointments.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setEditAppointment(a)}
                          className="w-full block p-2 rounded-md bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                        >
                          <div className="text-xs font-medium text-slate-900 dark:text-white">
                            {formatTime(a.dateTime)}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Paciente'}
                          </div>
                          <div className="mt-1">
                            <AppointmentStatusBadge status={a.status} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      </div>

      <AppointmentFormModal
        mode="edit"
        isOpen={!!editAppointment}
        appointment={editAppointment ?? undefined}
        onClose={() => setEditAppointment(null)}
      />
    </div>
  );
};

export default AppointmentAgendaView;
