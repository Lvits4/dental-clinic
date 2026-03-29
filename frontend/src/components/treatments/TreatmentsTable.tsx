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
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Link to={`/treatments/${t.id}/edit`}>
            <button
              title="Editar"
              className="p-1.5 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </Link>
          <button
            title={t.isActive ? 'Desactivar' : 'Activar'}
            onClick={() => onToggle(t.id)}
            disabled={togglePending}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
              t.isActive
                ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20'
                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20'
            }`}
          >
            {t.isActive ? (
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            ) : (
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
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
