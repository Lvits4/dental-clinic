import { Link } from 'react-router-dom';
import { Table, Badge } from '../ui';
import type { Column } from '../ui';
import type { Treatment } from '../../types';

interface TreatmentsTableProps {
  data: Treatment[];
  loading?: boolean;
  onToggle: (id: string) => void;
  togglePending?: boolean;
}

const TreatmentsTable = ({ data, loading, onToggle, togglePending }: TreatmentsTableProps) => {
  const columns: Column<Treatment>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (t) => <span className="font-medium text-slate-900 dark:text-white">{t.name}</span>,
    },
    { key: 'category', header: 'Categoría' },
    {
      key: 'defaultPrice',
      header: 'Precio',
      render: (t) => t.defaultPrice ? `$${Number(t.defaultPrice).toFixed(2)}` : '—',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (t) => (
        <Badge
          className={
            t.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {t.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (t) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link to={`/treatments/${t.id}/edit`}>
            <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
              Editar
            </button>
          </Link>
          <button
            onClick={() => onToggle(t.id)}
            disabled={togglePending}
            className={`text-xs hover:underline disabled:opacity-50 ${t.isActive ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}
          >
            {t.isActive ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table<Treatment>
      columns={columns}
      data={data}
      keyExtractor={(t) => t.id}
      loading={loading}
      emptyMessage="No hay tratamientos registrados"
    />
  );
};

export default TreatmentsTable;
