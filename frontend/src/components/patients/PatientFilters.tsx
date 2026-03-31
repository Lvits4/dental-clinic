import type { ReactNode } from 'react';
import { SearchInput } from '../ui';

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  /** Misma línea que el buscador, a la derecha (p. ej. “Nuevo paciente”) */
  trailingActions?: ReactNode;
}

const PatientFilters = ({ search, onSearchChange, trailingActions }: PatientFiltersProps) => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <label
          htmlFor="patient-filter-search"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Buscar
        </label>
        <SearchInput
          id="patient-filter-search"
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar por nombre..."
          fullWidth
          rounding="compact"
        />
      </div>

      {trailingActions ? (
        <div className="flex w-full shrink-0 flex-col sm:w-auto">
          <span
            className="mb-1.5 hidden h-5 select-none text-sm font-medium sm:block sm:invisible"
            aria-hidden="true"
          >
            Buscar
          </span>
          <div className="flex min-h-10 w-full items-center sm:h-10 sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">
            {trailingActions}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PatientFilters;
