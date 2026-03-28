import { Badge } from '../ui';
import { AppointmentStatus } from '../../enums';
import { STATUS_CONFIG } from '../../types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default AppointmentStatusBadge;
