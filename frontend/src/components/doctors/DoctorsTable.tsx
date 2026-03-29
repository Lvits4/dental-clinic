import { useNavigate } from 'react-router-dom';
import { Table, Badge } from '../ui';
import type { Column } from '../ui';
import type { Doctor } from '../../types';

interface DoctorsTableProps {
  data: Doctor[];
  loading?: boolean;
}

const DoctorsTable = ({ data, loading }: DoctorsTableProps) => {
  const navigate = useNavigate();

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (d) => (
        <span className="font-medium text-slate-900 dark:text-white">
          Dr. {d.firstName} {d.lastName}
        </span>
      ),
    },
    {
      key: 'specialty',
      header: 'Especialidad',
    },
    {
      key: 'phone',
      header: 'Teléfono',
      hideOnMobile: true,
    },
    {
      key: 'email',
      header: 'Correo',
      hideOnMobile: true,
    },
    {
      key: 'licenseNumber',
      header: 'Licencia',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (d) => (
        <Badge
          className={
            d.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {d.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  return (
    <Table<Doctor>
      columns={columns}
      data={data}
      keyExtractor={(d) => d.id}
      onRowClick={(d) => navigate(`/doctors/${d.id}`)}
      loading={loading}
      emptyMessage="No se encontraron doctores"
    />
  );
};

export default DoctorsTable;
