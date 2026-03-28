import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../requests/appointments.api';
import { useDoctorsList } from '../../doctors/hooks/useDoctorsList';
import AppointmentStatusBadge from '../components/AppointmentStatusBadge/AppointmentStatusBadge';
import Select from '../../../common/components/Select/Select';
import Button from '../../../common/components/Button/Button';
import Spinner from '../../../common/components/Spinner/Spinner';
import type { Appointment } from '../types/appointment.types';

function getWeekRange(date: Date): { from: string; to: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
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

  const { from, to } = useMemo(() => getWeekRange(baseDate), [baseDate]);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'agenda', from, to, doctorId],
    queryFn: () => appointmentsApi.getAgenda({
      dateFrom: from,
      dateTo: to,
      doctorId: doctorId || undefined,
    }),
  });

  const { data: doctors } = useDoctorsList();

  const doctorOptions = (doctors || []).map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName}`,
  }));

  // Group by day
  const groupedByDay = useMemo(() => {
    if (!appointments) return {};
    const grouped: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      const day = a.dateTime.split('T')[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(a);
    });
    // Sort within each day
    Object.values(grouped).forEach((arr) => arr.sort((a, b) => a.dateTime.localeCompare(b.dateTime)));
    return grouped;
  }, [appointments]);

  // Generate all days of the week
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agenda</h1>
        <Link to="/appointments/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Cita
          </Button>
        </Link>
      </div>

      {/* Controles de navegación */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-48 text-center">
            {new Date(from).toLocaleDateString('es', { day: 'numeric', month: 'short' })} — {new Date(to).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateWeek(1)}
            className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setBaseDate(new Date())}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

      {/* Vista semanal */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isToday = day === new Date().toISOString().split('T')[0];
            const dayAppointments = groupedByDay[day] || [];

            return (
              <div
                key={day}
                className={`
                  bg-white dark:bg-gray-800 rounded-lg border p-3 min-h-32
                  ${isToday
                    ? 'border-emerald-400 dark:border-emerald-600'
                    : 'border-gray-200 dark:border-gray-700'}
                `}
              >
                <h3 className={`text-xs font-semibold mb-2 capitalize ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formatDateShort(day)}
                </h3>
                {dayAppointments.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500">Sin citas</p>
                ) : (
                  <div className="space-y-1.5">
                    {dayAppointments.map((a) => (
                      <Link
                        key={a.id}
                        to={`/appointments/${a.id}`}
                        className="block p-2 rounded-md bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {formatTime(a.dateTime)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Paciente'}
                        </div>
                        <div className="mt-1">
                          <AppointmentStatusBadge status={a.status} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentAgendaView;
