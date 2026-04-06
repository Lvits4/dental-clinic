import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import DoctorsTable from '../../components/doctors/DoctorsTable';
import DoctorFilters from '../../components/doctors/DoctorFilters';
import DoctorFormModal from '../../components/doctors/DoctorFormModal';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import type { DoctorModalLocationState } from './DoctorRouteRedirects';
import type { DoctorSortBy, DoctorSortOrder } from '../../types';
import { totalPagesFromMeta } from '../../utils/pagination';
import { DEFAULT_LIST_PAGE_SIZE, LIST_PAGE_SIZE_MAX } from '../../constants/pagination';

type DoctorListModal = null | { mode: 'create' } | { mode: 'edit'; id: string };

const DoctorsListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<DoctorSortBy>('name');
  const [sortOrder, setSortOrder] = useState<DoctorSortOrder>('asc');
  const [modal, setModal] = useState<DoctorListModal>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [limit, setLimit] = useState(DEFAULT_LIST_PAGE_SIZE);

  const { data, isPending, isError, error, refetch } = useDoctorsList({
    page,
    limit,
    search: search.trim() || undefined,
    sortBy,
    sortOrder,
  });

  const listErrorMessage =
    error instanceof HttpError
      ? typeof error.details === 'string'
        ? error.details
        : Array.isArray(error.details)
          ? error.details.join(', ')
          : error.message
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar la lista de doctores.';

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (sortKey: string) => {
    const k = sortKey as DoctorSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder(k === 'isActive' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const hasFilters = !!search.trim();

  const resetFilters = () => {
    setSearch('');
    setPage(1);
  };

  useEffect(() => {
    const st = location.state as DoctorModalLocationState | null;
    if (!st?.openDoctorModal) return;
    navigate(location.pathname, { replace: true, state: {} });
    if (st.openDoctorModal === 'create') {
      setModal({ mode: 'create' });
      return;
    }
    if (st.openDoctorModal === 'edit' && st.doctorId) {
      setModal({ mode: 'edit', id: st.doctorId });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = totalPagesFromMeta(data.meta, limit);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta, isError, limit]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Doctores"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'doctor' : 'doctores'} ${hasFilters ? 'con el filtro actual' : 'en total'}`
              : !isError
                ? 'Equipo médico de la clínica'
                : undefined
          }
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Doctores' }]}
        />
      </div>

      <div className="shrink-0">
        <DoctorFilters
          search={search}
          onSearchChange={handleSearchChange}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
          trailingActions={
            <Button
              type="button"
              className="h-10 min-h-10 shrink-0 py-0! px-4 whitespace-nowrap rounded-md"
              onClick={() => setModal({ mode: 'create' })}
            >
              <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo doctor
            </Button>
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
          <DoctorsTable
            data={data?.data || []}
            loading={isPending && !data}
            onEditDoctor={(d) => setModal({ mode: 'edit', id: d.id })}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            fillHeight
            pagination={
              data && !isError
                ? {
                    page,
                    totalPages: totalPagesFromMeta(data.meta, limit),
                    total: data.meta.totalItems,
                    limit,
                    onPageChange: setPage,
                    onLimitChange: (n) => {
                      setLimit(n);
                      setPage(1);
                    },
                    minLimit: 1,
                    maxLimit: LIST_PAGE_SIZE_MAX,
                  }
                : undefined
            }
          />
        )}
      </div>

      <DoctorFormModal
        mode={modal?.mode === 'edit' ? 'edit' : 'create'}
        doctorId={modal?.mode === 'edit' ? modal.id : undefined}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      />
    </div>
  );
};

export default DoctorsListView;
