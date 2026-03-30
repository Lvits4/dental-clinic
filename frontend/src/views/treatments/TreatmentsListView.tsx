import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import TreatmentsTable from '../../components/treatments/TreatmentsTable';
import TreatmentFilters, { type TreatmentActiveFilter } from '../../components/treatments/TreatmentFilters';
import TreatmentFormModal from '../../components/treatments/TreatmentFormModal';
import { useTreatmentsList } from '../../querys/treatments/queryTreatments';
import { useToggleTreatment } from '../../querys/treatments/mutationTreatments';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../enums';
import type { TreatmentModalLocationState } from './TreatmentRouteRedirects';
import type { TreatmentSortBy, TreatmentSortOrder } from '../../types';

type TreatmentListModal = null | { mode: 'create' } | { mode: 'edit'; id: string };

const TreatmentsListView = () => {
  const { user } = useAuth();
  const canAdminTreatments = user?.role === Role.ADMIN;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<TreatmentActiveFilter>('all');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<TreatmentSortBy>('name');
  const [sortOrder, setSortOrder] = useState<TreatmentSortOrder>('asc');
  const [modal, setModal] = useState<TreatmentListModal>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const limit = 10;

  const isActiveParam = useMemo(() => {
    if (activeFilter === 'active') return true;
    if (activeFilter === 'inactive') return false;
    return undefined;
  }, [activeFilter]);

  const { data, isPending, isError, error, refetch } = useTreatmentsList({
    page,
    limit,
    name: search || undefined,
    category: category || undefined,
    isActive: isActiveParam,
    sortBy,
    sortOrder,
  });

  const toggleMutation = useToggleTreatment();

  const listErrorMessage =
    error instanceof HttpError
      ? typeof error.details === 'string'
        ? error.details
        : Array.isArray(error.details)
          ? error.details.join(', ')
          : error.message
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar el catálogo de tratamientos.';

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (sortKey: string) => {
    const k = sortKey as TreatmentSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder(k === 'createdAt' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const hasFilters = !!(search || category || activeFilter !== 'all');

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setActiveFilter('all');
    setPage(1);
  };

  useEffect(() => {
    const st = location.state as TreatmentModalLocationState | null;
    if (st?.openTreatmentModal === 'create') {
      navigate(location.pathname, { replace: true, state: {} });
      if (canAdminTreatments) {
        setModal({ mode: 'create' });
      }
      return;
    }
    if (st?.openTreatmentModal === 'edit' && st.treatmentId) {
      navigate(location.pathname, { replace: true, state: {} });
      if (canAdminTreatments) {
        setModal({ mode: 'edit', id: st.treatmentId });
      }
    }
  }, [location.state, location.pathname, navigate, canAdminTreatments]);

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
          title="Tratamientos"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'tratamiento' : 'tratamientos'} en total`
              : !isError
                ? 'Catálogo de servicios de la clínica'
                : undefined
          }
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Tratamientos' }]}
        />
      </div>

      <div className="shrink-0">
        <TreatmentFilters
          search={search}
          onSearchChange={handleSearchChange}
          activeFilter={activeFilter}
          onActiveFilterChange={(v) => {
            setActiveFilter(v);
            setPage(1);
          }}
          category={category}
          onCategoryChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
          trailingActions={
            canAdminTreatments ? (
              <Button
                type="button"
                className="h-10 min-h-10 shrink-0 !py-0 px-4 whitespace-nowrap rounded-md"
                onClick={() => setModal({ mode: 'create' })}
              >
                <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo tratamiento
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
          <TreatmentsTable
            data={data?.data || []}
            loading={isPending && !data}
            onToggle={(id) => toggleMutation.mutate(id)}
            togglePending={toggleMutation.isPending}
            onEditTreatment={canAdminTreatments ? (t) => setModal({ mode: 'edit', id: t.id }) : undefined}
            showAdminActions={canAdminTreatments}
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

      <TreatmentFormModal
        mode={modal?.mode === 'edit' ? 'edit' : 'create'}
        treatmentId={modal?.mode === 'edit' ? modal.id : undefined}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      />
    </div>
  );
};

export default TreatmentsListView;
