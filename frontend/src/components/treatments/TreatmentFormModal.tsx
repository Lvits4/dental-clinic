import { Modal, Spinner } from '../ui';
import TreatmentForm from './TreatmentForm';
import { useTreatmentDetail } from '../../querys/treatments/queryTreatments';
import { useCreateTreatment, useUpdateTreatment } from '../../querys/treatments/mutationTreatments';

export type TreatmentFormModalMode = 'create' | 'edit';

export interface TreatmentFormModalProps {
  mode: TreatmentFormModalMode;
  treatmentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

function CreateTreatmentModalBody({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateTreatment({ skipNavigation: true });

  return (
    <TreatmentForm
      onSubmit={(data) =>
        createMutation.mutate(data, {
          onSuccess: () => onClose(),
        })
      }
      loading={createMutation.isPending}
      submitLabel="Crear tratamiento"
      onCancel={onClose}
    />
  );
}

function EditTreatmentModalBody({ treatmentId, onClose }: { treatmentId: string; onClose: () => void }) {
  const { data: treatment, isLoading } = useTreatmentDetail(treatmentId);
  const updateMutation = useUpdateTreatment(treatmentId, { skipNavigation: true });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!treatment) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
        Tratamiento no encontrado
      </p>
    );
  }

  return (
    <TreatmentForm
      initialData={treatment}
      onSubmit={(data) =>
        updateMutation.mutate(data, {
          onSuccess: () => onClose(),
        })
      }
      loading={updateMutation.isPending}
      submitLabel="Guardar cambios"
      onCancel={onClose}
    />
  );
}

const TreatmentFormModal = ({ mode, treatmentId, isOpen, onClose }: TreatmentFormModalProps) => {
  const title = mode === 'create' ? 'Nuevo tratamiento' : 'Editar tratamiento';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      surfaceRounding="compact"
    >
      {mode === 'create' ? (
        <CreateTreatmentModalBody onClose={onClose} />
      ) : treatmentId ? (
        <EditTreatmentModalBody treatmentId={treatmentId} onClose={onClose} />
      ) : null}
    </Modal>
  );
};

export default TreatmentFormModal;
