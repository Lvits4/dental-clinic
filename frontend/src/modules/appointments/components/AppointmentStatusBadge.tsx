import Badge from '../../../shared/components/ui/Badge';
import { type AppointmentStatus, STATUS_CONFIG } from '../types/appointment.types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export default function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
