import { useNavigate } from 'react-router-dom';
import { Table, Badge } from '../ui';
import type { Column } from '../ui';
import type { User } from '../../types';
import { Role } from '../../enums';

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
  ];

  return (
    <Table<User>
      columns={columns}
      data={data}
      keyExtractor={(u) => u.id}
      onRowClick={(u) => navigate(`/users/${u.id}/edit`)}
      loading={loading}
      emptyMessage="No se encontraron usuarios"
    />
  );
};

export default UsersTable;
