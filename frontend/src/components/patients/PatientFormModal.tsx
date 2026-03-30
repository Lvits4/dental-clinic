import toast from 'react-hot-toast';
import { TOAST_NO_UPDATES } from '../../constants/userFeedback';
import { Modal, Spinner, FormModalScrollShell } from '../ui';
import PatientForm from './PatientForm';
import { usePatientDetail } from '../../querys/patients/queryPatients';
import { useCreatePatient, useUpdatePatient } from '../../querys/patients/mutationPatients';

export type PatientFormModalMode = 'create' | 'edit';

export interface PatientFormModalProps {
  mode: PatientFormModalMode;
  patientId?: string;
  isOpen: boolean;
  onClose: () => void;
}

function CreatePatientModalBody({ onClose }: { onClose: () => void }) {
  const createMutation = useCreatePatient({ skipNavigation: true });

  return (
    <FormModalScrollShell>
      <PatientForm
        fillParent
        onSubmit={(data) =>
          createMutation.mutate(data, {
            onSuccess: () => onClose(),
          })
        }
        loading={createMutation.isPending}
        submitLabel="Crear paciente"
        onCancel={onClose}
      />
    </FormModalScrollShell>
  );
}

function EditPatientModalBody({ patientId, onClose }: { patientId: string; onClose: () => void }) {
  const { data: patient, isLoading } = usePatientDetail(patientId);
  const updateMutation = useUpdatePatient(patientId, { skipNavigation: true });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
        Paciente no encontrado
      </p>
    );
  }

  return (
    <FormModalScrollShell>
      <PatientForm
        fillParent
        initialData={patient}
        onSubmit={(data) =>
          updateMutation.mutate(data, {
            onSuccess: () => onClose(),
          })
        }
        onUnchanged={() => {
          toast(TOAST_NO_UPDATES, { duration: 2800 });
          onClose();
        }}
        loading={updateMutation.isPending}
        submitLabel="Guardar cambios"
        onCancel={onClose}
      />
    </FormModalScrollShell>
  );
}

const PatientFormModal = ({ mode, patientId, isOpen, onClose }: PatientFormModalProps) => {
  const title = mode === 'create' ? 'Nuevo paciente' : 'Editar paciente';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      containBodyHeight
      surfaceRounding="compact"
      panelClassName="min-h-[min(26rem,90dvh)]"
    >
      {mode === 'create' ? (
        <CreatePatientModalBody onClose={onClose} />
      ) : patientId ? (
        <EditPatientModalBody patientId={patientId} onClose={onClose} />
      ) : null}
    </Modal>
  );
};

export default PatientFormModal;
