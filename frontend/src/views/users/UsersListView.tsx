import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import UsersTable from '../../components/users/UsersTable';
import UserFilters from '../../components/users/UserFilters';
import UserFormModal from '../../components/users/UserFormModal';
import { useUsersList } from '../../querys/users/queryUsers';
import type { User, UserSortBy, UserSortOrder } from '../../types';
import { Role } from '../../enums';
import type { UserModalLocationState } from './UserRouteRedirects';

const ROLE_SORT_LABEL: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.DOCTOR]: 'Doctor',
  [Role.RECEPTIONIST]: 'Recepcionista',
};

function matchesSearch(u: User, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const hay = [u.fullName, u.username, u.email].join(' ').toLowerCase();
  return hay.includes(s);
}

function compareUsers(a: User, b: User, sortBy: UserSortBy, sortOrder: UserSortOrder): number {
  const dir = sortOrder === 'asc' ? 1 : -1;
  let cmp = 0;
  switch (sortBy) {
    case 'fullName':
      cmp = a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' });
      break;
    case 'username':
      cmp = a.username.localeCompare(b.username, undefined, { sensitivity: 'base' });
      break;
    case 'email':
      cmp = a.email.localeCompare(b.email, 'es', { sensitivity: 'base' });
      break;
    case 'role':
      cmp = ROLE_SORT_LABEL[a.role].localeCompare(ROLE_SORT_LABEL[b.role], 'es', { sensitivity: 'base' });
      break;
    default:
      cmp = 0;
  }
  return cmp * dir;
}

type UserListModal = null | { mode: 'create' } | { mode: 'edit'; id: string };

const UsersListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState<UserSortBy>('fullName');
  const [sortOrder, setSortOrder] = useState<UserSortOrder>('asc');
  const [modal, setModal] = useState<UserListModal>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const limit = 10;

  const { data: rawList, isPending, isError, error, refetch } = useUsersList();

  const filtered = useMemo(() => {
    const list = rawList ?? [];
    return list.filter((u) => {
      if (!matchesSearch(u, search)) return false;
      if (roleFilter && u.role !== roleFilter) return false;
      return true;
    });
  }, [rawList, search, roleFilter]);

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => compareUsers(a, b, sortBy, sortOrder));
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
        : 'No se pudo cargar la lista de usuarios.';

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleSort = (sortKey: string) => {
    const k = sortKey as UserSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const hasFilters = !!(search.trim() || roleFilter);

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setPage(1);
  };

  useEffect(() => {
    const st = location.state as UserModalLocationState | null;
    if (!st?.openUserModal) return;
    navigate(location.pathname, { replace: true, state: {} });
    if (st.openUserModal === 'create') {
      setModal({ mode: 'create' });
      return;
    }
    if (st.openUserModal === 'edit' && st.userId) {
      setModal({ mode: 'edit', id: st.userId });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Usuarios"
          subtitle={
            rawList && !isError
              ? `${totalItems} ${totalItems === 1 ? 'usuario' : 'usuarios'} ${hasFilters ? 'con el filtro actual' : 'en total'}`
              : !isError
                ? 'Administración de cuentas del sistema'
                : undefined
          }
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Usuarios' }]}
        />
      </div>

      <div className="shrink-0">
        <UserFilters
          search={search}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
          trailingActions={
            <Button
              type="button"
              className="h-10 min-h-10 shrink-0 !py-0 px-4 whitespace-nowrap rounded-md"
              onClick={() => setModal({ mode: 'create' })}
            >
              <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo usuario
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
          <UsersTable
            data={pageData}
            loading={isPending && !rawList}
            onEditUser={(u) => setModal({ mode: 'edit', id: u.id })}
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

      <UserFormModal
        mode={modal?.mode === 'edit' ? 'edit' : 'create'}
        userId={modal?.mode === 'edit' ? modal.id : undefined}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      />
    </div>
  );
};

export default UsersListView;
