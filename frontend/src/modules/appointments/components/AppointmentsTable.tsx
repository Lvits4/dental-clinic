import { useNavigate } from 'react-router-dom';
import Table, { type Column } from '../../../shared/components/ui/Table';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import type { Appointment } from '../types/appointment.types';

interface AppointmentsTableProps {
  data: Appointment[];
  loading?: boolean;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AppointmentsTable({ data, loading }: AppointmentsTableProps) {
  const navigate = useNavigate();

  const columns: Column<Appointment>[] = [
    {
      key: 'dateTime',
      header: 'Fecha / Hora',
      render: (a) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatDateTime(a.dateTime)}
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'Paciente',
      render: (a) => a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : '—',
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (a) => a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : '—',
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (a) => a.reason || '—',
    },
    {
      key: 'durationMinutes',
      header: 'Duración',
      render: (a) => `${a.durationMinutes} min`,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (a) => <AppointmentStatusBadge status={a.status} />,
    },
  ];

  return (
    <Table<Appointment>
      columns={columns}
      data={data}
      keyExtractor={(a) => a.id}
      onRowClick={(a) => navigate(`/appointments/${a.id}`)}
      loading={loading}
      emptyMessage="No se encontraron citas"
    />
  );
}
