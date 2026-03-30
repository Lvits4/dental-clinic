import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import AppointmentsTable from '../../components/appointments/AppointmentsTable';
import AppointmentFilters from '../../components/appointments/AppointmentFilters';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
import { useAppointmentsList } from '../../querys/appointments/queryAppointments';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { AppointmentStatus } from '../../enums';
import type { AppointmentModalLocationState } from './AppointmentRouteRedirects';
import type { Appointment, AppointmentSortBy, AppointmentSortOrder } from '../../types';

type ListFormModal = null | { mode: 'create' } | { mode: 'edit'; appointment: Appointment };

const AppointmentsListView = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<AppointmentSortBy>('dateTime');
  const [sortOrder, setSortOrder] = useState<AppointmentSortOrder>('asc');
  const [formModal, setFormModal] = useState<ListFormModal>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const limit = 10;

  const { data, isPending, isError, error, refetch } = useAppointmentsList({
    page,
    limit,
    status: (status || undefined) as AppointmentStatus | undefined,
    doctorId: doctorId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy,
    sortOrder,
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

  const handleSort = (sortKey: string) => {
    const k = sortKey as AppointmentSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder(k === 'createdAt' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const listErrorMessage =
    error instanceof HttpError
      ? typeof error.details === 'string'
        ? error.details
        : Array.isArray(error.details)
          ? error.details.join(', ')
          : error.message
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar la lista de citas.';

  useEffect(() => {
    const st = location.state as AppointmentModalLocationState | null;
    if (st?.openAppointmentModal !== 'create') return;
    navigate(location.pathname, { replace: true, state: {} });
    setFormModal({ mode: 'create' });
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Citas"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'cita' : 'citas'} en total`
              : !isError
                ? 'Agenda y seguimiento de citas'
                : undefined
          }
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Citas' }]}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/appointments/agenda">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 min-h-10 shrink-0 !py-0 px-4 whitespace-nowrap rounded-md"
                >
                  <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Agenda
                </Button>
              </Link>
              <Button
                type="button"
                className="h-10 min-h-10 shrink-0 !py-0 px-4 whitespace-nowrap rounded-md"
                onClick={() => setFormModal({ mode: 'create' })}
              >
                <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva cita
              </Button>
            </div>
          }
        />
      </div>

      <div className="shrink-0">
        <AppointmentFilters
          status={status}
          doctorId={doctorId}
          dateFrom={dateFrom}
          dateTo={dateTo}
          doctorOptions={doctorOptions}
          filtersOpen={filtersOpen}
          onFiltersOpenChange={setFiltersOpen}
          onStatusChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onDoctorChange={(v) => {
            setDoctorId(v);
            setPage(1);
          }}
          onDateFromChange={(v) => {
            setDateFrom(v);
            setPage(1);
          }}
          onDateToChange={(v) => {
            setDateTo(v);
            setPage(1);
          }}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {isError ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-4 rounded-md border border-red-200 bg-red-50/90 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm text-red-800 dark:text-red-200 max-w-md">{listErrorMessage}</p>
            <Button type="button" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <AppointmentsTable
            data={data?.data || []}
            loading={isPending && !data}
            fillHeight
            onEditRequest={(a) => setFormModal({ mode: 'edit', appointment: a })}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            pagination={
              data && !isError
                ? {
                    page: data.meta.page,
                    totalPages: data.meta.totalPages,
                    total: data.meta.totalItems,
                    limit: data.meta.limit,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        )}
      </div>

      <AppointmentFormModal
        mode={formModal?.mode === 'edit' ? 'edit' : 'create'}
        isOpen={formModal !== null}
        onClose={() => setFormModal(null)}
        appointment={formModal?.mode === 'edit' ? formModal.appointment : undefined}
      />
    </div>
  );
};

export default AppointmentsListView;
