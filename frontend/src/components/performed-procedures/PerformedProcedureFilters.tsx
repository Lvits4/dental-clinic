import type { ReactNode } from 'react';
import { SearchInput, ClearFiltersButton } from '../ui';

interface PerformedProcedureFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  /** Misma línea que el buscador, a la derecha */
  trailingActions?: ReactNode;
}

const PerformedProcedureFilters = ({
  search,
  onSearchChange,
  hasFilters,
  onResetFilters,
  trailingActions,
}: PerformedProcedureFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex w-full min-w-0 items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <label
            htmlFor="performed-procedure-filter-search"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Buscar
          </label>
          <SearchInput
            id="performed-procedure-filter-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Paciente, doctor, tratamiento, pieza, descripción..."
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
          <ClearFiltersButton onClick={onResetFilters} />
        </div>
      ) : null}
    </div>
  );
};

export default PerformedProcedureFilters;
