import type { ReactNode } from 'react';
import { SearchInput } from '../ui';

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  /** Controles a la derecha del buscador (p. ej. “Nuevo paciente”), alineados en altura */
  trailingActions?: ReactNode;
}

const PatientFilters = ({ search, onSearchChange, trailingActions }: PatientFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full max-w-72 md:max-w-80 min-w-0 shrink-0">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar por nombre..."
          fullWidth
          rounding="compact"
        />
      </div>

      {trailingActions && (
        <div className="flex shrink-0 items-center">{trailingActions}</div>
      )}
    </div>
  );
};

export default PatientFilters;
