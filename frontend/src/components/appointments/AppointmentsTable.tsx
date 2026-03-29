import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Modal, ConfirmDialog, DatePicker, TimePicker, Select } from '../ui';
import type { Column } from '../ui';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import type { Appointment } from '../../types';
import { STATUS_CONFIG, VALID_STATUS_TRANSITIONS, DURATION_OPTIONS } from '../../types';
import { AppointmentStatus } from '../../enums';
import {
  useUpdateStatus,
  useCancelAppointment,
  useRescheduleAppointment,
} from '../../querys/appointments/mutationAppointments';

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

// Colores por estado para los botones del modal
const STATUS_BUTTON_CLASSES: Partial<Record<AppointmentStatus, string>> = {
  [AppointmentStatus.CONFIRMED]:   'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  [AppointmentStatus.IN_PROGRESS]: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  [AppointmentStatus.ATTENDED]:    'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/40',
  [AppointmentStatus.CANCELLED]:   'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
  [AppointmentStatus.NO_SHOW]:     'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20',
};

const AppointmentsTable = ({ data, loading }: AppointmentsTableProps) => {
  const navigate = useNavigate();
  const [statusTarget, setStatusTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDuration, setRescheduleDuration] = useState('30');

  const updateStatus = useUpdateStatus();
  const cancelAppointment = useCancelAppointment();
  const rescheduleAppointment = useRescheduleAppointment();

  const columns: Column<Appointment>[] = [
    {
      key: 'dateTime',
      header: 'Fecha / Hora',
      render: (a) => (
        <span className="font-medium text-slate-900 dark:text-white">
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
      hideOnMobile: true,
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (a) => a.reason || '—',
      hideOnMobile: true,
    },
    {
      key: 'durationMinutes',
      header: 'Duración',
      render: (a) => `${a.durationMinutes} min`,
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (a) => <AppointmentStatusBadge status={a.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      hideOnMobile: true,
      render: (a) => {
        const transitions = VALID_STATUS_TRANSITIONS[a.status as AppointmentStatus] ?? [];
        const canChange = transitions.length > 0;
        const isTerminal = ['attended', 'cancelled', 'no_show'].includes(a.status);

        return (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ver detalle */}
            <button
              title="Ver detalle"
              onClick={() => navigate(`/appointments/${a.id}`)}
              className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            {/* Cambiar estado */}
            {canChange && (
              <button
                title="Cambiar estado"
                onClick={() => setStatusTarget(a)}
                className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}

            {/* Reprogramar */}
            {!isTerminal && (
              <button
                title="Reprogramar"
                onClick={() => {
                  const dt = new Date(a.dateTime);
                  const yyyy = dt.getFullYear();
                  const mm = String(dt.getMonth() + 1).padStart(2, '0');
                  const dd = String(dt.getDate()).padStart(2, '0');
                  const hh = String(dt.getHours()).padStart(2, '0');
                  const min = String(dt.getMinutes()).padStart(2, '0');
                  setRescheduleDate(`${yyyy}-${mm}-${dd}`);
                  setRescheduleTime(`${hh}:${min}`);
                  setRescheduleDuration(String(a.durationMinutes ?? 30));
                  setRescheduleTarget(a);
                }}
                className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            )}

            {/* Cancelar */}
            {!isTerminal && (
              <button
                title="Cancelar cita"
                onClick={() => setCancelTarget(a)}
                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // Transiciones del appointment seleccionado
  const transitions = statusTarget
    ? (VALID_STATUS_TRANSITIONS[statusTarget.status as AppointmentStatus] ?? [])
    : [];

  return (
    <>
      <Table<Appointment>
        columns={columns}
        data={data}
        keyExtractor={(a) => a.id}
        onRowClick={(a) => navigate(`/appointments/${a.id}`)}
        loading={loading}
        emptyMessage="No se encontraron citas"
      />

      {/* Modal cambio de estado */}
      <Modal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        title="Cambiar estado de cita"
        size="sm"
      >
        {statusTarget && (
          <div className="space-y-4">
            {/* Info de la cita */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 space-y-1">
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {formatDateTime(statusTarget.dateTime)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {statusTarget.patient
                  ? `${statusTarget.patient.firstName} ${statusTarget.patient.lastName}`
                  : '—'}
                {statusTarget.doctor
                  ? ` · Dr. ${statusTarget.doctor.firstName} ${statusTarget.doctor.lastName}`
                  : ''}
              </p>
              <div className="pt-1">
                <AppointmentStatusBadge status={statusTarget.status} />
              </div>
            </div>

            {/* Opciones de estado */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Cambiar a
              </p>
              <div className="flex flex-col gap-2">
                {transitions.map((status) => (
                  <button
                    key={status}
                    disabled={updateStatus.isPending}
                    onClick={() => {
                      updateStatus.mutate(
                        { id: statusTarget.id, status },
                        { onSettled: () => setStatusTarget(null) },
                      );
                    }}
                    className={[
                      'w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer',
                      STATUS_BUTTON_CLASSES[status] ??
                        'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/40',
                    ].join(' ')}
                  >
                    {STATUS_CONFIG[status]?.label ?? status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ConfirmDialog cancelar cita */}
      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => {
          if (cancelTarget) {
            cancelAppointment.mutate(cancelTarget.id, {
              onSettled: () => setCancelTarget(null),
            });
          }
        }}
        title="Cancelar cita"
        message={`¿Estás seguro de cancelar la cita del ${cancelTarget ? formatDateTime(cancelTarget.dateTime) : ''}? Esta acción no se puede deshacer.`}
        confirmLabel="Cancelar cita"
        variant="danger"
        loading={cancelAppointment.isPending}
      />

      {/* Modal reprogramar cita */}
      <Modal
        isOpen={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        title="Reprogramar cita"
        size="sm"
        footer={
          rescheduleTarget ? (
            <>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={!rescheduleDate || !rescheduleTime || rescheduleAppointment.isPending}
                onClick={() => {
                  if (!rescheduleDate || !rescheduleTime || !rescheduleTarget) return;
                  rescheduleAppointment.mutate(
                    {
                      id: rescheduleTarget.id,
                      data: {
                        dateTime: `${rescheduleDate}T${rescheduleTime}:00`,
                        durationMinutes: Number(rescheduleDuration),
                      },
                    },
                    { onSettled: () => setRescheduleTarget(null) },
                  );
                }}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {rescheduleAppointment.isPending ? 'Guardando...' : 'Reprogramar'}
              </button>
            </>
          ) : undefined
        }
      >
        {rescheduleTarget && (
          <div className="space-y-4">
            {/* Info de la cita original */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Fecha actual
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {formatDateTime(rescheduleTarget.dateTime)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {rescheduleTarget.patient
                  ? `${rescheduleTarget.patient.firstName} ${rescheduleTarget.patient.lastName}`
                  : '—'}
                {rescheduleTarget.doctor
                  ? ` · Dr. ${rescheduleTarget.doctor.firstName} ${rescheduleTarget.doctor.lastName}`
                  : ''}
              </p>
            </div>

            {/* Nueva fecha y hora */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Nueva fecha y hora
              </p>
              <DatePicker
                label="Fecha"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <TimePicker
                label="Hora"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                placeholder="Seleccionar hora..."
              />
              <Select
                label="Duración"
                options={DURATION_OPTIONS}
                value={rescheduleDuration}
                onChange={(e) => setRescheduleDuration(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AppointmentsTable;
