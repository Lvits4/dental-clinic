import { Link } from 'react-router-dom';
import { useTreatmentsList } from '../hooks/useTreatmentsList';
import { useToggleTreatment } from '../hooks/useToggleTreatment';
import Table, { type Column } from '../../../shared/components/ui/Table';
import Badge from '../../../shared/components/ui/Badge';
import Button from '../../../shared/components/ui/Button';
import type { Treatment } from '../types/treatment.types';

export default function TreatmentsListView() {
  const { data, isLoading } = useTreatmentsList();
  const toggleMutation = useToggleTreatment();

  const columns: Column<Treatment>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (t) => <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>,
    },
    { key: 'category', header: 'Categoría' },
    {
      key: 'defaultPrice',
      header: 'Precio',
      render: (t) => t.defaultPrice ? `$${Number(t.defaultPrice).toFixed(2)}` : '—',
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
            onClick={() => toggleMutation.mutate(t.id)}
            className={`text-xs hover:underline ${t.isActive ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}
          >
            {t.isActive ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catálogo de Tratamientos</h1>
        <Link to="/treatments/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Tratamiento
          </Button>
        </Link>
      </div>
      <Table<Treatment>
        columns={columns}
        data={data || []}
        keyExtractor={(t) => t.id}
        loading={isLoading}
        emptyMessage="No hay tratamientos registrados"
      />
    </div>
  );
}
