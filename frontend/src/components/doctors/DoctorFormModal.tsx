import toast from 'react-hot-toast';
import { TOAST_NO_UPDATES } from '../../constants/userFeedback';
import { Modal, Spinner, FormModalScrollShell } from '../ui';
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
    <FormModalScrollShell>
      <DoctorForm
        fillParent
        onSubmit={(data) =>
          createMutation.mutate(data, {
            onSuccess: () => onClose(),
          })
        }
        loading={createMutation.isPending}
        submitLabel="Crear doctor"
        onCancel={onClose}
      />
    </FormModalScrollShell>
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
    <FormModalScrollShell>
      <DoctorForm
        fillParent
        key={doctor.id}
        initialData={doctor}
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

const DoctorFormModal = ({ mode, doctorId, isOpen, onClose }: DoctorFormModalProps) => {
  const title = mode === 'create' ? 'Nuevo doctor' : 'Editar doctor';

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
        <CreateDoctorModalBody onClose={onClose} />
      ) : doctorId ? (
        <EditDoctorModalBody doctorId={doctorId} onClose={onClose} />
      ) : null}
    </Modal>
  );
};

export default DoctorFormModal;
