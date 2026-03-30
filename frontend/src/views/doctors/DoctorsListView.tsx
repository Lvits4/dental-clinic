import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import DoctorsTable from '../../components/doctors/DoctorsTable';
import DoctorFilters from '../../components/doctors/DoctorFilters';
import DoctorFormModal from '../../components/doctors/DoctorFormModal';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import type { DoctorModalLocationState } from './DoctorRouteRedirects';
import type { Doctor, DoctorSortBy, DoctorSortOrder } from '../../types';

type DoctorListModal = null | { mode: 'create' } | { mode: 'edit'; id: string };

function matchesSearch(d: Doctor, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const hay = [
    d.firstName,
    d.lastName,
    d.specialty,
    d.email,
    d.phone,
    d.licenseNumber,
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(s);
}

function compareDoctors(a: Doctor, b: Doctor, sortBy: DoctorSortBy, sortOrder: DoctorSortOrder): number {
  const dir = sortOrder === 'asc' ? 1 : -1;
  let cmp = 0;
  switch (sortBy) {
    case 'name':
      cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'es', {
        sensitivity: 'base',
      });
      break;
    case 'specialty':
      cmp = a.specialty.localeCompare(b.specialty, 'es', { sensitivity: 'base' });
      break;
    case 'phone':
      cmp = a.phone.localeCompare(b.phone, undefined, { numeric: true });
      break;
    case 'email':
      cmp = (a.email || '').localeCompare(b.email || '', 'es', { sensitivity: 'base' });
      break;
    case 'licenseNumber':
      cmp = a.licenseNumber.localeCompare(b.licenseNumber, undefined, { numeric: true });
      break;
    case 'isActive':
      cmp = Number(a.isActive) - Number(b.isActive);
      break;
    default:
      cmp = 0;
  }
  return cmp * dir;
}

const DoctorsListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<DoctorSortBy>('name');
  const [sortOrder, setSortOrder] = useState<DoctorSortOrder>('asc');
  const [modal, setModal] = useState<DoctorListModal>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const limit = 10;

  const { data: rawList, isPending, isError, error, refetch } = useDoctorsList();

  const filtered = useMemo(() => {
    const list = rawList ?? [];
    return list.filter((d) => matchesSearch(d, search));
  }, [rawList, search]);

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => compareDoctors(a, b, sortBy, sortOrder));
    return list;
  }, [filtered, sortBy, sortOrder]);

  const totalItems = sortedFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    const start = (safePage - 1) * limit;
    return sortedFiltered.slice(start, start + limit);
  }, [sortedFiltered, safePage, limit]);

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

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Doctores"
          subtitle={
            rawList && !isError
              ? `${totalItems} ${totalItems === 1 ? 'doctor' : 'doctores'} ${hasFilters ? 'con el filtro actual' : 'en total'}`
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
            data={pageData}
            loading={isPending && !rawList}
            onEditDoctor={(d) => setModal({ mode: 'edit', id: d.id })}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            fillHeight
            pagination={
              !isError && totalItems > 0
                ? {
                    page: safePage,
                    totalPages,
                    total: totalItems,
                    limit,
                    onPageChange: setPage,
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
