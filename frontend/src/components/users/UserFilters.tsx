import type { ReactNode } from 'react';
import { SearchInput, Select, ClearFiltersButton } from '../ui';
import { Role } from '../../enums';

const ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: Role.ADMIN, label: 'Administrador' },
  { value: Role.DOCTOR, label: 'Doctor' },
  { value: Role.RECEPTIONIST, label: 'Recepcionista' },
];

const FILTER_SELECT_TRIGGER_CLASS =
  'h-10 min-h-10 shrink-0 py-0 flex items-center [&>span]:min-h-0';

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  trailingActions?: ReactNode;
}

const UserFilters = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  hasFilters,
  onResetFilters,
  trailingActions,
}: UserFiltersProps) => {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex w-full min-w-0 items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <label
            htmlFor="user-filter-search"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Buscar
          </label>
          <SearchInput
            id="user-filter-search"
            value={search}
            onChange={onSearchChange}
            placeholder="Nombre, usuario o correo..."
            fullWidth
            rounding="compact"
          />
        </div>
        <div className="shrink-0 sm:min-w-44">
          <Select
            label="Rol"
            className={FILTER_SELECT_TRIGGER_CLASS}
            options={ROLE_OPTIONS}
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
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

export default UserFilters;
