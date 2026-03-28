import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointmentsList } from '../hooks/useAppointmentsList';
import { useDoctorsList } from '../../doctors/hooks/useDoctorsList';
import AppointmentsTable from '../components/AppointmentsTable';
import AppointmentFilters from '../components/AppointmentFilters';
import Pagination from '../../../shared/components/ui/Pagination';
import Button from '../../../shared/components/ui/Button';
import type { AppointmentStatus } from '../types/appointment.types';

export default function AppointmentsListView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const limit = 10;

  const { data, isLoading } = useAppointmentsList({
    page,
    limit,
    status: (status || undefined) as AppointmentStatus | undefined,
    doctorId: doctorId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const { data: doctors } = useDoctorsList();

  const resetFilters = () => {
    setStatus('');
    setDoctorId('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Citas</h1>
        <div className="flex items-center gap-2">
          <Link to="/appointments/agenda">
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agenda
            </Button>
          </Link>
          <Link to="/appointments/new">
            <Button>
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Cita
            </Button>
          </Link>
        </div>
      </div>

      <AppointmentFilters
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        doctorId={doctorId}
        onDoctorChange={(v) => { setDoctorId(v); setPage(1); }}
        dateFrom={dateFrom}
        onDateFromChange={(v) => { setDateFrom(v); setPage(1); }}
        dateTo={dateTo}
        onDateToChange={(v) => { setDateTo(v); setPage(1); }}
        doctors={doctors || []}
      />

      {(status || doctorId || dateFrom || dateTo) && (
        <button
          onClick={resetFilters}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Limpiar filtros
        </button>
      )}

      <AppointmentsTable data={data?.data || []} loading={isLoading} />

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          limit={data.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
