import type { ReactNode } from 'react';
import { SearchInput, Select } from '../ui';
import { TreatmentPlanStatus } from '../../enums';
import { PLAN_STATUS_CONFIG } from '../../types';

export type PlanStatusFilter = 'all' | TreatmentPlanStatus;

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  ...Object.values(TreatmentPlanStatus).map((s) => ({
    value: s,
    label: PLAN_STATUS_CONFIG[s]?.label ?? s,
  })),
];

const FILTER_SELECT_TRIGGER_CLASS =
  'h-10 min-h-10 shrink-0 py-0 flex items-center [&>span]:min-h-0';

interface TreatmentPlanFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: PlanStatusFilter;
  onStatusFilterChange: (value: PlanStatusFilter) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  trailingActions?: ReactNode;
}

const TreatmentPlanFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  hasFilters,
  onResetFilters,
  trailingActions,
}: TreatmentPlanFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex w-full max-w-72 md:max-w-80 min-w-0 shrink-0 flex-col">
          <label
            htmlFor="treatment-plan-filter-search"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Buscar
          </label>
          <SearchInput
            id="treatment-plan-filter-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Paciente, doctor u observaciones..."
            fullWidth
            rounding="compact"
          />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[12rem] shrink-0">
          <Select
            label="Estado del plan"
            className={FILTER_SELECT_TRIGGER_CLASS}
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as PlanStatusFilter)}
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

export default TreatmentPlanFilters;
