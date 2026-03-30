import { Select, DatePicker } from '../ui';
import { STATUS_OPTIONS } from '../../types';

export interface DoctorFilterOption {
  value: string;
  label: string;
}

interface AppointmentFiltersProps {
  status: string;
  doctorId: string;
  dateFrom: string;
  dateTo: string;
  doctorOptions: DoctorFilterOption[];
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  onStatusChange: (value: string) => void;
  onDoctorChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
}

const AppointmentFilters = ({
  status,
  doctorId,
  dateFrom,
  dateTo,
  doctorOptions,
  filtersOpen,
  onFiltersOpenChange,
  onStatusChange,
  onDoctorChange,
  onDateFromChange,
  onDateToChange,
  hasFilters,
  onResetFilters,
}: AppointmentFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <button
        type="button"
        className="sm:hidden w-full flex items-center justify-between px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
        onClick={() => onFiltersOpenChange(!filtersOpen)}
      >
        <span className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtros
          {hasFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md shrink-0">
              activos
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`${filtersOpen ? 'block' : 'hidden'} sm:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            placeholder="Todos los estados"
          />
          <Select
            options={doctorOptions}
            value={doctorId}
            onChange={(e) => onDoctorChange(e.target.value)}
            placeholder="Todos los doctores"
          />
          <DatePicker
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            placeholder="Desde"
          />
          <DatePicker
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            placeholder="Hasta"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline self-start"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

export default AppointmentFilters;
