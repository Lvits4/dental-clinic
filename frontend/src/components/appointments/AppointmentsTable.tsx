import { useState } from 'react';
import { Table, Modal } from '../ui';
import type { Column } from '../ui';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import type { Appointment } from '../../types';
import { STATUS_CONFIG } from '../../types';
import { AppointmentStatus } from '../../enums';
import {
  useUpdateStatus,
  useUpdateAppointment,
} from '../../querys/appointments/mutationAppointments';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import AppointmentForm from './AppointmentForm';

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

// Colores semánticos por estado
const STATUS_BUTTON_CLASSES: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]:   'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
  [AppointmentStatus.CONFIRMED]:   'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  [AppointmentStatus.IN_PROGRESS]: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  [AppointmentStatus.ATTENDED]:    'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/40',
  [AppointmentStatus.CANCELLED]:   'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
  [AppointmentStatus.NO_SHOW]:     'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20',
};

const AppointmentsTable = ({ data, loading }: AppointmentsTableProps) => {
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);

  const updateStatus    = useUpdateStatus();
  const updateAppointment = useUpdateAppointment();
  const { data: patientsData } = usePatientsList({ limit: 100 });
  const { data: doctorsData }  = useDoctorsList();
  const activePatients = (patientsData?.data ?? []).filter((p) => p.isActive);
  const activeDoctors  = (doctorsData ?? []).filter((d) => d.isActive);

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
      render: (a) => (
        <div
          className="flex items-center justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            title="Editar cita"
            onClick={() => setEditTarget(a)}
            className="p-2 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  // Todos los estados posibles excepto el actual
  const allStatusesExceptCurrent = editTarget
    ? Object.values(AppointmentStatus).filter((s) => s !== editTarget.status)
    : [];

  return (
    <>
      <Table<Appointment>
        columns={columns}
        data={data}
        keyExtractor={(a) => a.id}
        loading={loading}
        emptyMessage="No se encontraron citas"
      />

      {/* Modal editar cita */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar cita"
        size="lg"
      >
        {editTarget && (
          <AppointmentForm
            patients={activePatients}
            doctors={activeDoctors}
            initialValues={{
              patientId:       editTarget.patientId,
              doctorId:        editTarget.doctorId,
              date:            editTarget.dateTime.slice(0, 10),
              time:            editTarget.dateTime.slice(11, 16),
              durationMinutes: editTarget.durationMinutes,
              reason:          editTarget.reason,
              notes:           editTarget.notes,
            }}
            onSubmit={(data) => {
              updateAppointment.mutate(
                { id: editTarget.id, data },
                { onSettled: () => setEditTarget(null) },
              );
            }}
            loading={updateAppointment.isPending}
            submitLabel="Guardar cambios"
            footerContent={
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Estado actual
                  </p>
                  <AppointmentStatusBadge status={editTarget.status} />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                  Cambiar a:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allStatusesExceptCurrent.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate(
                          { id: editTarget.id, status },
                          {
                            onSuccess: () => {
                              setEditTarget((prev) => prev ? { ...prev, status } : null);
                            },
                          },
                        )
                      }
                      className={[
                        'px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer',
                        STATUS_BUTTON_CLASSES[status],
                      ].join(' ')}
                    >
                      {STATUS_CONFIG[status]?.label ?? status}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
        )}
      </Modal>
    </>
  );
};

export default AppointmentsTable;
