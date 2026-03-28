import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppointmentDetail } from '../hooks/useAppointmentDetail';
import { useUpdateAppointmentStatus } from '../hooks/useUpdateAppointmentStatus';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import AppointmentStatusBadge from '../components/AppointmentStatusBadge/AppointmentStatusBadge';
import { AppointmentStatus, STATUS_OPTIONS } from '../types/appointment.types';
import Button from '../../../common/components/Button/Button';
import ConfirmDialog from '../../../common/components/ConfirmDialog/ConfirmDialog';
import Spinner from '../../../common/components/Spinner/Spinner';

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
        <p className="text-gray-500 dark:text-gray-400">Cita no encontrada</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            to="/appointments"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detalle de Cita</h1>
        </div>

        {canChangeStatus && (
          <div className="flex items-center gap-2">
            <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
              Cancelar Cita
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {formatDateTime(appointment.dateTime)}
          </h2>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <dl className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Paciente</dt>
            <dd className="text-sm text-gray-900 dark:text-white">
              {appointment.patient
                ? <Link to={`/patients/${appointment.patientId}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{appointment.patient.firstName} {appointment.patient.lastName}</Link>
                : '—'}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Doctor</dt>
            <dd className="text-sm text-gray-900 dark:text-white">
              {appointment.doctor
                ? <Link to={`/doctors/${appointment.doctorId}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</Link>
                : '—'}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Duración</dt>
            <dd className="text-sm text-gray-900 dark:text-white">{appointment.durationMinutes} minutos</dd>
          </div>
          {appointment.reason && (
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Motivo</dt>
              <dd className="text-sm text-gray-900 dark:text-white">{appointment.reason}</dd>
            </div>
          )}
          {appointment.notes && (
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Notas</dt>
              <dd className="text-sm text-gray-900 dark:text-white whitespace-pre-line">{appointment.notes}</dd>
            </div>
          )}
        </dl>

        {/* Cambiar estado */}
        {canChangeStatus && (
          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Cambiar estado
            </h3>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => statusMutation.mutate(s.value as AppointmentStatus)}
                  disabled={statusMutation.isPending}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-700
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
