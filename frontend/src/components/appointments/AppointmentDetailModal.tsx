import { Modal } from '../ui';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import type { Appointment } from '../../types';

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

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
    <span className="text-slate-800 dark:text-slate-200 break-words text-sm">{value}</span>
  </div>
);

export interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestEdit?: () => void;
  showEditButton?: boolean;
}

const AppointmentDetailModal = ({
  appointment,
  isOpen,
  onClose,
  onRequestEdit,
  showEditButton = true,
}: AppointmentDetailModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de cita"
      size="md"
      fitContent
      surfaceRounding="compact"
    >
      {appointment && (
        <div className="space-y-4 text-sm">
          <DetailRow label="Fecha / Hora" value={formatDateTime(appointment.dateTime)} />
          <DetailRow
            label="Paciente"
            value={
              appointment.patient
                ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                : '—'
            }
          />
          <DetailRow
            label="Doctor"
            value={
              appointment.doctor
                ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                : '—'
            }
          />
          <DetailRow label="Duración" value={`${appointment.durationMinutes} min`} />
          <DetailRow label="Motivo" value={appointment.reason || '—'} />
          <DetailRow label="Notas" value={appointment.notes || '—'} />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">Estado</span>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          {showEditButton && onRequestEdit ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                onClick={() => {
                  onRequestEdit();
                  onClose();
                }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar cita
              </button>
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;
