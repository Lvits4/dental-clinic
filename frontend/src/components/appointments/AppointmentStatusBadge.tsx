import { Badge } from '../ui';
import { AppointmentStatus } from '../../enums';
import { STATUS_CONFIG } from '../../types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

/**
 * Busca la config del status normalizando a UPPER_CASE para evitar
 * desajustes entre lo que manda el backend y las keys del enum.
 */
function resolveStatusConfig(status: string) {
  // 1. Intento directo
  const direct = STATUS_CONFIG[status as AppointmentStatus];
  if (direct) return direct;

  // 2. Normalizar a UPPER_CASE (por si el backend manda "scheduled", "Scheduled", etc.)
  const normalized = status?.toUpperCase() as AppointmentStatus;
  const fromNormalized = STATUS_CONFIG[normalized];
  if (fromNormalized) return fromNormalized;

  // 3. Busqueda por valor del enum (por si manda "in_progress" y el enum es "IN_PROGRESS")
  const enumKey = Object.keys(AppointmentStatus).find(
    (k) => AppointmentStatus[k as keyof typeof AppointmentStatus].toUpperCase() === status?.toUpperCase(),
  );
  if (enumKey) {
    return STATUS_CONFIG[AppointmentStatus[enumKey as keyof typeof AppointmentStatus]];
  }

  return null;
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const config = resolveStatusConfig(status);

  if (!config) {
    // Si aun asi no encuentra nada, mostrar el valor tal cual en vez de "Desconocido"
    return (
      <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {status || 'Sin estado'}
      </Badge>
    );
  }

  return <Badge className={config.className}>{config.label}</Badge>;
};

export default AppointmentStatusBadge;
