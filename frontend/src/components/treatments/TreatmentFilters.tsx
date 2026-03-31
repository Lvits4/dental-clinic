import type { ReactNode } from 'react';
import { SearchInput, Select, ClearFiltersButton } from '../ui';
import { TREATMENT_CATEGORIES } from '../../types';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Todas las categorías' },
  ...TREATMENT_CATEGORIES,
];

/** Misma altura que el trigger de `Select` para alinear con `SearchInput` (h-10). */
const FILTER_SELECT_TRIGGER_CLASS =
  'h-10 min-h-10 shrink-0 py-0 flex items-center [&>span]:min-h-0';

interface TreatmentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  trailingActions?: ReactNode;
}

const TreatmentFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  hasFilters,
  onResetFilters,
  trailingActions,
}: TreatmentFiltersProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {/*
        En viewport estrecho, fila única (buscar + categoría + botón) solapa etiquetas y comprime el select.
        Apilar hasta lg; en lg+ una sola fila alineada al pie de los campos.
      */}
      <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <label
            htmlFor="treatment-filter-search"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Buscar
          </label>
          <SearchInput
            id="treatment-filter-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar por nombre..."
            fullWidth
            rounding="compact"
          />
        </div>
        <div className="min-w-0 w-full lg:w-auto lg:min-w-48 lg:max-w-xs lg:shrink-0">
          <Select
            label="Categoría"
            className={FILTER_SELECT_TRIGGER_CLASS}
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          />
        </div>
        {trailingActions ? (
          <div className="flex w-full shrink-0 flex-col lg:w-auto">
            <span
              className="mb-1.5 hidden h-5 select-none text-sm font-medium lg:block lg:invisible"
              aria-hidden="true"
            >
              Categoría
            </span>
            <div className="flex min-h-10 w-full items-center lg:h-10 lg:w-auto [&_button]:w-full lg:[&_button]:w-auto">
              {trailingActions}
            </div>
          </div>
        ) : null}
      </div>
      {hasFilters && <ClearFiltersButton onClick={onResetFilters} />}
    </div>
  );
};

export default TreatmentFilters;
