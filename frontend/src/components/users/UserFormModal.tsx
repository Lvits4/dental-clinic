import toast from 'react-hot-toast';
import { Modal, Spinner, FormModalScrollShell } from '../ui';
import { TOAST_NO_UPDATES } from '../../constants/userFeedback';
import UserForm from './UserForm';
import { useUserById } from '../../querys/users/queryUsers';
import { useCreateUser, useUpdateUser } from '../../querys/users/mutationUsers';

export type UserFormModalMode = 'create' | 'edit';

export interface UserFormModalProps {
  mode: UserFormModalMode;
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

function CreateUserModalBody({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateUser({ skipNavigation: true });

  return (
    <FormModalScrollShell>
      <UserForm
        fillParent
        mode="create"
        onSubmit={(data) =>
          createMutation.mutate(data, {
            onSuccess: () => onClose(),
          })
        }
        loading={createMutation.isPending}
        submitLabel="Crear usuario"
        onCancel={onClose}
      />
    </FormModalScrollShell>
  );
}

function EditUserModalBody({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: user, isPending: userLoading } = useUserById(userId);
  const updateMutation = useUpdateUser(userId, { skipNavigation: true });

  if (userLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
        Usuario no encontrado
      </p>
    );
  }

  return (
    <FormModalScrollShell>
      <UserForm
        fillParent
        key={user.id}
        mode="edit"
        initialData={user}
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

const UserFormModal = ({ mode, userId, isOpen, onClose }: UserFormModalProps) => {
  const title = mode === 'create' ? 'Nuevo usuario' : 'Editar usuario';

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
        <CreateUserModalBody onClose={onClose} />
      ) : userId ? (
        <EditUserModalBody userId={userId} onClose={onClose} />
      ) : null}
    </Modal>
  );
};

export default UserFormModal;
