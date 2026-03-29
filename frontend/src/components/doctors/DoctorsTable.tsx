import { Link, useNavigate } from 'react-router-dom';
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
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      hideOnMobile: true,
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Ver detalle */}
          <Link to={`/doctors/${d.id}`}>
            <button
              title="Ver detalle"
              className="p-1.5 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </Link>
          {/* Editar */}
          <Link to={`/doctors/${d.id}/edit`}>
            <button
              title="Editar"
              className="p-1.5 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 transition-colors"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </Link>
        </div>
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
