import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Badge } from '../ui';
import type { Column } from '../ui';
import type { User } from '../../types';
import { Role } from '../../enums';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useDeactivateUser, useActivateUser } from '../../querys/users/mutationUsers';

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

interface UsersTableProps {
  data: User[];
  loading?: boolean;
}

const UsersTable = ({ data, loading }: UsersTableProps) => {
  const navigate = useNavigate();
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);
  const deactivateUser = useDeactivateUser();
  const activateUser = useActivateUser();

  const columns: Column<User>[] = [
    {
      key: 'fullName',
      header: 'Nombre',
      render: (u) => (
        <span className="font-medium text-slate-900 dark:text-white">{u.fullName}</span>
      ),
    },
    {
      key: 'username',
      header: 'Usuario',
      render: (u) => (
        <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">@{u.username}</span>
      ),
    },
    {
      key: 'email',
      header: 'Correo',
      hideOnMobile: true,
    },
    {
      key: 'role',
      header: 'Rol',
      render: (u) => (
        <Badge className={ROLE_CLASSES[u.role]}>
          {ROLE_LABELS[u.role]}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (u) => (
        <Badge
          className={
            u.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {u.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      hideOnMobile: true,
      render: (u) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Editar */}
          <button
            title="Editar"
            onClick={() => navigate(`/users/${u.id}/edit`)}
            className="p-2 rounded-md text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Desactivar / Activar */}
          {u.isActive ? (
            <button
              title="Desactivar"
              onClick={() => setUserToDeactivate(u)}
              className="p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </button>
          ) : (
            <button
              title="Activar"
              onClick={() => setUserToActivate(u)}
              className="p-2 rounded-md text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-150 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table<User>
        columns={columns}
        data={data}
        keyExtractor={(u) => u.id}
        onRowClick={(u) => navigate(`/users/${u.id}/edit`)}
        loading={loading}
        emptyMessage="No se encontraron usuarios"
      />

      {/* Modal desactivar */}
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
        title="Desactivar usuario"
        message={`¿Estás seguro de que deseas desactivar a ${userToDeactivate?.fullName}? El usuario no podrá iniciar sesión, pero sus datos se conservarán.`}
        confirmLabel="Desactivar"
        variant="danger"
        loading={deactivateUser.isPending}
      />

      {/* Modal activar */}
      <ConfirmDialog
        isOpen={!!userToActivate}
        onClose={() => setUserToActivate(null)}
        onConfirm={() => {
          if (userToActivate) {
            activateUser.mutate(userToActivate.id, {
              onSettled: () => setUserToActivate(null),
            });
          }
        }}
        title="Activar usuario"
        message={`¿Deseas activar nuevamente a ${userToActivate?.fullName}? El usuario podrá volver a iniciar sesión.`}
        confirmLabel="Activar"
        variant="primary"
        loading={activateUser.isPending}
      />
    </>
  );
};

export default UsersTable;
