import Badge from '../../../../common/components/Badge/Badge';
import { type AppointmentStatus, STATUS_CONFIG } from '../../types/appointment.types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default AppointmentStatusBadge;
