import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Spinner, FormModalScrollShell } from '../ui';
import AppointmentForm from './AppointmentForm';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import {
  useCreateAppointment,
  useUpdateAppointment,
  useUpdateStatus,
} from '../../querys/appointments/mutationAppointments';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsForSelect } from '../../querys/doctors/queryDoctors';
import { useAppointmentDetail } from '../../querys/appointments/queryAppointments';
import toast from 'react-hot-toast';
import { AppointmentStatus } from '../../enums';
import { TOAST_NO_UPDATES } from '../../constants/userFeedback';
import { STATUS_CONFIG } from '../../types';
import type { Appointment } from '../../types';

const STATUS_BUTTON_CLASSES: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]:   'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
  [AppointmentStatus.CONFIRMED]:   'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  [AppointmentStatus.IN_PROGRESS]: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  [AppointmentStatus.ATTENDED]:    'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/40',
  [AppointmentStatus.CANCELLED]:   'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
  [AppointmentStatus.NO_SHOW]:     'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20',
};

const FormSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="rounded-md bg-slate-100 dark:bg-slate-800 h-10 w-48" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 rounded-md bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
    <div className="h-px bg-slate-100 dark:bg-slate-800" />
    <div className="flex justify-end">
      <div className="h-10 w-32 rounded-md bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);

const EmptyState = ({
  title,
  message,
  linkTo,
  linkLabel,
}: {
  title: string;
  message: string;
  linkTo: string;
  linkLabel: string;
}) => (
  <div className="text-center py-10">
    <div className="w-12 h-12 rounded-md bg-amber-50 dark:bg-amber-900/20 mx-auto mb-3 flex items-center justify-center">
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{message}</p>
    <Link
      to={linkTo}
      viewTransition
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
    >
      {linkLabel}
    </Link>
  </div>
);

function CreateAppointmentModalBody({
  onClose,
  defaultPatientId,
}: {
  onClose: () => void;
  defaultPatientId?: string;
}) {
  const createMutation = useCreateAppointment({ skipNavigation: true });
  const { data: patientsData, isLoading: loadingPatients } = usePatientsList({ limit: 100, isActive: true });
  const { data: doctors, isLoading: loadingDoctors } = useDoctorsForSelect();

  const loading = loadingPatients || loadingDoctors;
  const activePatients = patientsData?.data || [];
  const activeDoctors = (doctors || []).filter((d) => d.isActive);

  if (loading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FormSkeleton />
      </div>
    );
  }

  if (activePatients.length === 0) {
    return (
      <EmptyState
        title="No hay pacientes activos"
        message="Debe crear o activar al menos un paciente antes de agendar una cita."
        linkTo="/patients"
        linkLabel="Ir a Pacientes"
      />
    );
  }

  return (
    <FormModalScrollShell>
      <AppointmentForm
        fillParent
        patients={activePatients}
        doctors={activeDoctors}
        defaultPatientId={defaultPatientId}
        onSubmit={(data) =>
          createMutation.mutate(data, {
            onSuccess: () => onClose(),
          })
        }
        loading={createMutation.isPending}
        submitLabel="Crear cita"
        onCancel={onClose}
      />
    </FormModalScrollShell>
  );
}

function EditAppointmentModalBody({
  appointment: initialAppointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const [localAppt, setLocalAppt] = useState(initialAppointment);
  useEffect(() => {
    setLocalAppt(initialAppointment);
  }, [initialAppointment]);

  const updateAppointment = useUpdateAppointment();
  const updateStatus = useUpdateStatus();
  const { data: patientsData } = usePatientsList({ limit: 100 });
  const { data: doctorsData } = useDoctorsForSelect();
  const activePatients = (patientsData?.data ?? []).filter((p) => p.isActive);
  const activeDoctors = (doctorsData ?? []).filter((d) => d.isActive);

  const allStatusesExceptCurrent = Object.values(AppointmentStatus).filter((s) => s !== localAppt.status);

  return (
    <FormModalScrollShell>
      <AppointmentForm
        fillParent
        key={localAppt.id}
        patients={activePatients}
        doctors={activeDoctors}
      initialValues={{
        patientId: localAppt.patientId,
        doctorId: localAppt.doctorId,
        date: localAppt.dateTime.slice(0, 10),
        time: localAppt.dateTime.slice(11, 16),
        durationMinutes: localAppt.durationMinutes,
        reason: localAppt.reason,
        notes: localAppt.notes,
      }}
      onSubmit={(data) => {
        updateAppointment.mutate(
          { id: localAppt.id, data },
          {
            onSuccess: () => onClose(),
          },
        );
      }}
      loading={updateAppointment.isPending}
      submitLabel="Guardar cambios"
      onCancel={onClose}
      onUnchanged={() => {
        toast(TOAST_NO_UPDATES, { duration: 2800 });
        onClose();
      }}
      footerContent={
        <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Estado actual
            </p>
            <AppointmentStatusBadge status={localAppt.status} />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Cambiar a:</p>
          <div className="flex flex-wrap gap-2">
            {allStatusesExceptCurrent.map((status) => (
              <button
                key={status}
                type="button"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate(
                    { id: localAppt.id, status },
                    {
                      onSuccess: () => {
                        setLocalAppt((prev) => ({ ...prev, status }));
                      },
                    },
                  )
                }
                className={[
                  'px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer',
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
    </FormModalScrollShell>
  );
}

function EditAppointmentByIdBody({ appointmentId, onClose }: { appointmentId: string; onClose: () => void }) {
  const { data: appointment, isLoading } = useAppointmentDetail(appointmentId);

  if (isLoading) {
    return (
      <div className="flex min-h-56 flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!appointment) {
    return (
      <p className="flex-1 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Cita no encontrada</p>
    );
  }

  return <EditAppointmentModalBody appointment={appointment} onClose={onClose} />;
}

export type AppointmentFormModalMode = 'create' | 'edit';

export interface AppointmentFormModalProps {
  mode: AppointmentFormModalMode;
  isOpen: boolean;
  onClose: () => void;
  /** Modo crear: paciente preseleccionado (p. ej. ficha de paciente) */
  defaultPatientId?: string;
  /** Modo editar: objeto ya cargado */
  appointment?: Appointment | null;
  /** Modo editar: solo id (carga en el modal) */
  appointmentId?: string;
}

const AppointmentFormModal = ({
  mode,
  isOpen,
  onClose,
  defaultPatientId,
  appointment,
  appointmentId,
}: AppointmentFormModalProps) => {
  const title = mode === 'create' ? 'Nueva cita' : 'Editar cita';

  const editBody =
    mode === 'edit'
      ? appointment
        ? <EditAppointmentModalBody appointment={appointment} onClose={onClose} />
        : appointmentId
          ? <EditAppointmentByIdBody appointmentId={appointmentId} onClose={onClose} />
          : null
      : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      containBodyHeight
      surfaceRounding="compact"
      panelClassName="min-h-[min(26rem,90dvh)]"
    >
      {mode === 'create' ? (
        <CreateAppointmentModalBody onClose={onClose} defaultPatientId={defaultPatientId} />
      ) : (
        editBody
      )}
    </Modal>
  );
};

export default AppointmentFormModal;
