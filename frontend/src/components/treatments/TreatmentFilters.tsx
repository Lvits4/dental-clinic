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
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex w-full min-w-0 items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <label
            htmlFor="treatment-filter-search"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
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
        <div className="shrink-0 sm:min-w-48">
          <Select
            label="Categoría"
            className={FILTER_SELECT_TRIGGER_CLASS}
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          />
        </div>
        {trailingActions ? (
          <div className="flex shrink-0 flex-col">
            <span
              className="invisible mb-1.5 block select-none text-sm font-medium"
              aria-hidden="true"
            >
              Categoría
            </span>
            <div className="flex h-10 min-h-10 items-center">{trailingActions}</div>
          </div>
        ) : null}
      </div>
      {hasFilters && <ClearFiltersButton onClick={onResetFilters} />}
    </div>
  );
};

export default TreatmentFilters;
