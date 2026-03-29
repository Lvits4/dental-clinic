import { useParams } from 'react-router-dom';
import { PageHeader, Spinner } from '../../components/ui';
import UserForm from '../../components/users/UserForm';
import { useUserById } from '../../querys/users/queryUsers';
import { useUpdateUser } from '../../querys/users/mutationUsers';

const UserEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useUserById(id!);
  const updateMutation = useUpdateUser(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Usuario no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Editar Usuario"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Usuarios', to: '/users' },
          { label: user.fullName },
        ]}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <UserForm
          mode="edit"
          initialData={user}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default UserEditView;
