import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Button, ConfirmDialog, Spinner } from '../../components/ui';
import AppointmentStatusBadge from '../../components/appointments/AppointmentStatusBadge';
import { useAppointmentDetail } from '../../querys/appointments/queryAppointments';
import { useUpdateAppointmentStatus, useCancelAppointment } from '../../querys/appointments/mutationAppointments';
import { AppointmentStatus } from '../../enums';
import { STATUS_OPTIONS } from '../../types';

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AppointmentDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: appointment, isLoading } = useAppointmentDetail(id!);
  const statusMutation = useUpdateAppointmentStatus(id!);
  const cancelMutation = useCancelAppointment();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Cita no encontrada</p>
      </div>
    );
  }

  const handleCancel = () => {
    cancelMutation.mutate(id!, {
      onSuccess: () => {
        setShowCancelDialog(false);
        navigate('/appointments');
      },
    });
  };

  const canChangeStatus = appointment.status !== AppointmentStatus.CANCELLED
    && appointment.status !== AppointmentStatus.ATTENDED;

  const nextStatuses = STATUS_OPTIONS.filter(
    (s) => s.value !== appointment.status && s.value !== AppointmentStatus.CANCELLED,
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Detalle de Cita"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Citas', to: '/appointments' },
          { label: 'Detalle' },
        ]}
        action={
          canChangeStatus ? (
            <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
              Cancelar Cita
            </Button>
          ) : undefined
        }
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDateTime(appointment.dateTime)}
          </h2>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <dl className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Paciente</dt>
            <dd className="text-sm text-slate-900 dark:text-white">
              {appointment.patient
                ? <Link to={`/patients/${appointment.patientId}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{appointment.patient.firstName} {appointment.patient.lastName}</Link>
                : '—'}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Doctor</dt>
            <dd className="text-sm text-slate-900 dark:text-white">
              {appointment.doctor
                ? <Link to={`/doctors/${appointment.doctorId}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</Link>
                : '—'}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Duración</dt>
            <dd className="text-sm text-slate-900 dark:text-white">{appointment.durationMinutes} minutos</dd>
          </div>
          {appointment.reason && (
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Motivo</dt>
              <dd className="text-sm text-slate-900 dark:text-white">{appointment.reason}</dd>
            </div>
          )}
          {appointment.notes && (
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Notas</dt>
              <dd className="text-sm text-slate-900 dark:text-white whitespace-pre-line">{appointment.notes}</dd>
            </div>
          )}
        </dl>

        {/* Cambiar estado */}
        {canChangeStatus && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Cambiar estado
            </h3>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => statusMutation.mutate(s.value as AppointmentStatus)}
                  disabled={statusMutation.isPending}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600
                    text-slate-700 dark:text-slate-300
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    disabled:opacity-50 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancelar cita"
        message="¿Estás seguro de cancelar esta cita?"
        confirmLabel="Cancelar Cita"
        loading={cancelMutation.isPending}
      />
    </div>
  );
};

export default AppointmentDetailView;
