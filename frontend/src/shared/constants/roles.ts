import { Role } from '../types/common';
import type { SelectOption } from '../types/common';

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.DOCTOR]: 'Doctor',
  [Role.RECEPTIONIST]: 'Recepcionista',
};

export const ROLE_OPTIONS: SelectOption[] = Object.values(Role).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));
