import { useNavigate } from 'react-router-dom';
import Table, { type Column } from '../../../shared/components/ui/Table';
import Badge from '../../../shared/components/ui/Badge';
import type { Doctor } from '../types/doctor.types';

interface DoctorsTableProps {
  data: Doctor[];
  loading?: boolean;
}

export default function DoctorsTable({ data, loading }: DoctorsTableProps) {
  const navigate = useNavigate();

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (d) => (
        <span className="font-medium text-gray-900 dark:text-white">
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
    },
    {
      key: 'email',
      header: 'Correo',
    },
    {
      key: 'licenseNumber',
      header: 'Licencia',
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
}
