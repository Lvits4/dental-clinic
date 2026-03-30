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
    <div className="flex w-full min-w-0 items-end gap-2">
      <div className="min-w-0 flex-1 flex flex-col">
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
  );
};

export default PatientFilters;
