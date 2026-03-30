import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Select, DatePicker, Pagination } from '../../components/ui';
import AppointmentsTable from '../../components/appointments/AppointmentsTable';
import { useAppointmentsList } from '../../querys/appointments/queryAppointments';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { AppointmentStatus } from '../../enums';
import { STATUS_OPTIONS } from '../../types';

const AppointmentsListView = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  const doctorOptions = (doctors || []).map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName}`,
  }));

  const hasFilters = !!(status || doctorId || dateFrom || dateTo);

  const resetFilters = () => {
    setStatus('');
    setDoctorId('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Citas"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Citas' }]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/appointments/agenda">
              <Button variant="secondary">
                <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agenda
              </Button>
            </Link>
            <Link to="/appointments/new">
              <Button>
                <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Cita
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filtros — colapsables en mobile */}
      <div>
        <button
          className="sm:hidden w-full flex items-center justify-between px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtros
            {hasFilters && <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md">activos</span>}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Panel de filtros — siempre visible en sm+, condicional en mobile */}
        <div className={`${filtersOpen ? 'block' : 'hidden'} sm:block mt-2 sm:mt-0`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              placeholder="Todos los estados"
            />
            <Select
              options={doctorOptions}
              value={doctorId}
              onChange={(e) => { setDoctorId(e.target.value); setPage(1); }}
              placeholder="Todos los doctores"
            />
            <DatePicker
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              placeholder="Desde"
            />
            <DatePicker
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              placeholder="Hasta"
            />
          </div>
        </div>
      </div>

      {hasFilters && (
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
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.totalItems}
          limit={data.meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AppointmentsListView;
