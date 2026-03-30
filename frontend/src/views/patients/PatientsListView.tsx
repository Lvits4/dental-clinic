import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import PatientsTable from '../../components/patients/PatientsTable';
import PatientFilters from '../../components/patients/PatientFilters';
import PatientFormModal from '../../components/patients/PatientFormModal';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../enums';
import type { PatientModalLocationState } from './PatientRouteRedirects';
import type { PatientSortBy, PatientSortOrder } from '../../types';

type PatientListModal = null | { mode: 'create' } | { mode: 'edit'; id: string };

const PatientsListView = () => {
  const { user } = useAuth();
  const canEditPatient =
    user?.role === Role.ADMIN || user?.role === Role.RECEPTIONIST;
  const canDeactivatePatient = user?.role === Role.ADMIN;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<PatientSortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<PatientSortOrder>('desc');
  const [modal, setModal] = useState<PatientListModal>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const limit = 10;

  const { data, isPending, isError, error, refetch } = usePatientsList({
    page,
    limit,
    name: search || undefined,
    sortBy,
    sortOrder,
  });

  const listErrorMessage =
    error instanceof HttpError
      ? (typeof error.details === 'string'
          ? error.details
          : Array.isArray(error.details)
            ? error.details.join(', ')
            : error.message)
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar la lista de pacientes.';

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (sortKey: string) => {
    const k = sortKey as PatientSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder(k === 'createdAt' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  useEffect(() => {
    const st = location.state as PatientModalLocationState | null;
    if (st?.openPatientModal !== 'create') return;
    navigate(location.pathname, { replace: true, state: {} });
    if (canEditPatient) {
      setModal({ mode: 'create' });
    }
  }, [location.state, location.pathname, navigate, canEditPatient]);

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = Math.max(1, data.meta.totalPages);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta.totalPages, isError]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Pacientes"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'paciente' : 'pacientes'} en total`
              : !isError
                ? 'Directorio de fichas de la clínica'
                : undefined
          }
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Pacientes' }]}
        />
      </div>

      <div className="shrink-0">
        <PatientFilters
          search={search}
          onSearchChange={handleSearchChange}
          trailingActions={
            canEditPatient ? (
              <Button
                type="button"
                className="h-10 min-h-10 shrink-0 py-0! px-4 whitespace-nowrap rounded-md"
                onClick={() => setModal({ mode: 'create' })}
              >
                <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo paciente
              </Button>
            ) : null
          }
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
          <PatientsTable
            data={data?.data || []}
            loading={isPending && !data}
            onEditPatient={(p) => setModal({ mode: 'edit', id: p.id })}
            showEdit={canEditPatient}
            showDeactivate={canDeactivatePatient}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            fillHeight
            pagination={
              data && !isError
                ? {
                    page,
                    totalPages: Math.max(1, data.meta.totalPages),
                    total: data.meta.totalItems,
                    limit: data.meta.limit,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        )}
      </div>

      <PatientFormModal
        mode={modal?.mode === 'edit' ? 'edit' : 'create'}
        patientId={modal?.mode === 'edit' ? modal.id : undefined}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      />

    </div>
  );
};

export default PatientsListView;
