import { useState } from 'react';
import { SearchInput, Select } from '../ui';

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

const PatientFilters = ({
  search,
  onSearchChange,
  statusFilter = '',
  onStatusFilterChange,
}: PatientFiltersProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* Fila principal - siempre visible */}
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar por nombre..."
          />
        </div>

        {/* Boton para mostrar filtros adicionales en mobile */}
        {onStatusFilterChange && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={[
              'sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
              expanded
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400'
                : 'bg-white border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300',
            ].join(' ')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
        )}

        {/* Select de estado - siempre visible en sm+ */}
        {onStatusFilterChange && (
          <div className="hidden sm:block w-40">
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Filtros adicionales - expandibles en mobile */}
      {onStatusFilterChange && expanded && (
        <div className="sm:hidden">
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default PatientFilters;
