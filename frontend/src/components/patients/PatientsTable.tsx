import { useNavigate } from 'react-router-dom';
import { Table, Badge } from '../ui';
import type { Column } from '../ui';
import type { Patient } from '../../types';

interface PatientsTableProps {
  data: Patient[];
  loading?: boolean;
}

const SEX_LABELS: Record<string, string> = {
  male: 'M',
  female: 'F',
  other: 'Otro',
};

const PatientsTable = ({ data, loading }: PatientsTableProps) => {
  const navigate = useNavigate();

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (p) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {p.firstName} {p.lastName}
        </span>
      ),
    },
    {
      key: 'sex',
      header: 'Sexo',
      render: (p) => SEX_LABELS[p.sex] || p.sex,
    },
    {
      key: 'phone',
      header: 'Telefono',
    },
    {
      key: 'email',
      header: 'Correo',
      render: (p) => p.email || '—',
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (p) => (
        <Badge
          className={
            p.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {p.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  // Vista mobile: cards
  if (typeof window !== 'undefined' && window.innerWidth < 640) {
    return (
      <div className="space-y-2 sm:hidden">
        {loading ? (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            Cargando...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            No se encontraron pacientes
          </div>
        ) : (
          data.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {p.firstName} {p.lastName}
                </span>
                <Badge
                  className={
                    p.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }
                >
                  {p.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{p.phone}</p>
              {p.email && (
                <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{p.email}</p>
              )}
            </button>
          ))
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">No se encontraron pacientes</div>
        ) : (
          data.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {p.firstName} {p.lastName}
                </span>
                <Badge
                  className={
                    p.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }
                >
                  {p.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{p.phone}</p>
              {p.email && (
                <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{p.email}</p>
              )}
            </button>
          ))
        )}
      </div>

      {/* Desktop tabla */}
      <div className="hidden sm:block">
        <Table<Patient>
          columns={columns}
          data={data}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => navigate(`/patients/${p.id}`)}
          loading={loading}
          emptyMessage="No se encontraron pacientes"
        />
      </div>
    </>
  );
};

export default PatientsTable;
