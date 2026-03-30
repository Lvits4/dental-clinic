import type { ReactNode } from 'react';
import { SearchInput } from '../ui';

interface DoctorFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  trailingActions?: ReactNode;
}

const DoctorFilters = ({
  search,
  onSearchChange,
  hasFilters,
  onResetFilters,
  trailingActions,
}: DoctorFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex w-full min-w-0 items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <label
            htmlFor="doctor-filter-search"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Buscar
          </label>
          <SearchInput
            id="doctor-filter-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Nombre, especialidad, correo..."
            fullWidth
            rounding="compact"
          />
        </div>
        {trailingActions ? (
          <div className="flex shrink-0 flex-col">
            <span
              className="mb-1.5 block select-none text-sm font-medium invisible"
              aria-hidden="true"
            >
              Buscar
            </span>
            <div className="flex h-10 min-h-10 items-center">{trailingActions}</div>
          </div>
        ) : null}
      </div>
      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default DoctorFilters;
