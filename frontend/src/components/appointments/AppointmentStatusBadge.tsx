import { Badge } from '../ui';
import type { AppointmentStatus } from '../../enums';
import { STATUS_CONFIG } from '../../types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {status || 'Sin estado'}
      </Badge>
    );
  }

  return <Badge className={config.className}>{config.label}</Badge>;
};

export default AppointmentStatusBadge;
