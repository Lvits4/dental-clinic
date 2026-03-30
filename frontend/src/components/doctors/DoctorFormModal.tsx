import toast from 'react-hot-toast';
import { Modal, Spinner } from '../ui';
import DoctorForm from './DoctorForm';
import { useDoctorDetail } from '../../querys/doctors/queryDoctors';
import { useCreateDoctor, useUpdateDoctor } from '../../querys/doctors/mutationDoctors';

export type DoctorFormModalMode = 'create' | 'edit';

export interface DoctorFormModalProps {
  mode: DoctorFormModalMode;
  doctorId?: string;
  isOpen: boolean;
  onClose: () => void;
}

function CreateDoctorModalBody({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateDoctor({ skipNavigation: true });

  return (
    <DoctorForm
      onSubmit={(data) =>
        createMutation.mutate(data, {
          onSuccess: () => onClose(),
        })
      }
      loading={createMutation.isPending}
      submitLabel="Crear doctor"
      onCancel={onClose}
    />
  );
}

function EditDoctorModalBody({ doctorId, onClose }: { doctorId: string; onClose: () => void }) {
  const { data: doctor, isPending: doctorLoading } = useDoctorDetail(doctorId);
  const updateMutation = useUpdateDoctor(doctorId, { skipNavigation: true });

  if (doctorLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!doctor) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
        Doctor no encontrado
      </p>
    );
  }

  return (
    <DoctorForm
      key={doctor.id}
      initialData={doctor}
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

const DoctorFormModal = ({ mode, doctorId, isOpen, onClose }: DoctorFormModalProps) => {
  const title = mode === 'create' ? 'Nuevo doctor' : 'Editar doctor';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      surfaceRounding="compact"
    >
      {mode === 'create' ? (
        <CreateDoctorModalBody onClose={onClose} />
      ) : doctorId ? (
        <EditDoctorModalBody doctorId={doctorId} onClose={onClose} />
      ) : null}
    </Modal>
  );
};

export default DoctorFormModal;
