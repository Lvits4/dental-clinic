import toast from 'react-hot-toast';
import { Modal, Spinner } from '../ui';
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
    <PatientForm
      onSubmit={(data) =>
        createMutation.mutate(data, {
          onSuccess: () => onClose(),
        })
      }
      loading={createMutation.isPending}
      submitLabel="Crear paciente"
      onCancel={onClose}
    />
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
    <PatientForm
      initialData={patient}
      onSubmit={(data) =>
        updateMutation.mutate(data, {
          onSuccess: () => onClose(),
        })
      }
      onUnchanged={() => {
        toast('No hay cambios que guardar', { duration: 2800 });
        onClose();
      }}
      loading={updateMutation.isPending}
      submitLabel="Guardar cambios"
      onCancel={onClose}
    />
  );
}

const PatientFormModal = ({ mode, patientId, isOpen, onClose }: PatientFormModalProps) => {
  const title = mode === 'create' ? 'Nuevo paciente' : 'Editar paciente';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl" fitContent>
      {mode === 'create' ? (
        <CreatePatientModalBody onClose={onClose} />
      ) : patientId ? (
        <EditPatientModalBody patientId={patientId} onClose={onClose} />
      ) : null}
    </Modal>
  );
};

export default PatientFormModal;
