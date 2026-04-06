import { useState } from 'react';
import { Table, Badge, ConfirmDialog, Pagination } from '../ui';
import type { Column } from '../ui';
import type { User, UserSortBy, UserSortOrder } from '../../types';
import { Role } from '../../enums';
import { useDeactivateUser } from '../../querys/users/mutationUsers';

const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.DOCTOR]: 'Doctor',
  [Role.RECEPTIONIST]: 'Recepcionista',
};

const ROLE_CLASSES: Record<Role, string> = {
  [Role.ADMIN]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  [Role.DOCTOR]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [Role.RECEPTIONIST]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const TrashIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

interface UsersTableProps {
  data: User[];
  loading?: boolean;
  onEditUser: (user: User) => void;
  sortColumn?: UserSortBy | null;
  sortDirection?: UserSortOrder;
  onSort?: (sortKey: string) => void;
  fillHeight?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    minLimit?: number;
    maxLimit?: number;
  };
}

const UsersTable = ({
  data,
  loading,
  onEditUser,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  fillHeight = false,
  pagination,
}: UsersTableProps) => {
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const deactivateUser = useDeactivateUser();

  const actionButtons = (u: User) => (
    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Editar"
        onClick={() => onEditUser(u)}
        className="p-1.5 rounded-md text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 transition-colors"
      >
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Eliminar de la lista"
        onClick={() => setUserToDeactivate(u)}
        className="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
      >
        <TrashIcon />
      </button>
    </div>
  );

  const columns: Column<User>[] = [
    {
      key: 'fullName',
      header: 'Nombre',
      sortKey: 'fullName',
      render: (u) => (
        <span className="font-medium text-slate-900 dark:text-white">{u.fullName}</span>
      ),
    },
    {
      key: 'username',
      header: 'Usuario',
      sortKey: 'username',
      render: (u) => (
        <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">@{u.username}</span>
      ),
    },
    {
      key: 'email',
      header: 'Correo',
      sortKey: 'email',
      hideOnMobile: true,
    },
    {
      key: 'role',
      header: 'Rol',
      sortKey: 'role',
      render: (u) => (
        <Badge className={ROLE_CLASSES[u.role]}>
          {ROLE_LABELS[u.role]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-center w-[9.5rem]',
      hideOnMobile: true,
      render: (u) => actionButtons(u),
    },
  ];

  const rootClass = fillHeight ? 'flex flex-col flex-1 min-h-0 min-w-0 gap-2' : 'flex flex-col gap-2';

  const paginationProps = pagination
    ? { embedded: true as const, compact: true as const, ...pagination }
    : null;
  const mobileWrap = fillHeight
    ? 'md:hidden flex-1 min-h-0 overflow-y-auto space-y-2'
    : 'md:hidden space-y-2';

  return (
    <div className={rootClass}>
      <div className={mobileWrap}>
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">No se encontraron usuarios</div>
        ) : (
          data.map((u) => (
            <div
              key={u.id}
              className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <button
                type="button"
                onClick={() => onEditUser(u)}
                className="w-full text-left mb-3"
              >
                <span className="font-medium text-slate-900 dark:text-white block">{u.fullName}</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">@{u.username}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
              </button>
              <div className="flex justify-center pt-2 border-t border-slate-100 dark:border-slate-700">
                {actionButtons(u)}
              </div>
            </div>
          ))
        )}
      </div>

      {paginationProps && (
        <div className="md:hidden shrink-0 rounded-md border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Pagination {...paginationProps} />
        </div>
      )}

      <div className={fillHeight ? 'hidden md:flex md:flex-1 md:min-h-0 md:flex-col min-w-0' : 'hidden md:block min-w-0'}>
        <Table<User>
          columns={columns}
          data={data}
          keyExtractor={(u) => u.id}
          onRowClick={onEditUser}
          loading={loading}
          emptyMessage="No se encontraron usuarios"
          sortColumn={sortColumn ?? undefined}
          sortDirection={sortDirection}
          onSort={onSort}
          fillHeight={fillHeight}
          headerVariant="sentence"
          surfaceRounding="compact"
          footer={paginationProps ? <Pagination {...paginationProps} /> : undefined}
        />
      </div>

      <ConfirmDialog
        isOpen={!!userToDeactivate}
        onClose={() => setUserToDeactivate(null)}
        onConfirm={() => {
          if (userToDeactivate) {
            deactivateUser.mutate(userToDeactivate.id, {
              onSettled: () => setUserToDeactivate(null),
            });
          }
        }}
        title="Eliminar usuario"
        message={`¿Eliminar a ${userToDeactivate?.fullName} de la lista? La cuenta pasará a inactiva, no podrá iniciar sesión y dejará de mostrarse aquí.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deactivateUser.isPending}
      />
    </div>
  );
};

export default UsersTable;
