import { Badge } from '../ui';
import { AppointmentStatus } from '../../enums';
import { STATUS_CONFIG } from '../../types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const FALLBACK = { label: 'Desconocido', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? FALLBACK;
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default AppointmentStatusBadge;
