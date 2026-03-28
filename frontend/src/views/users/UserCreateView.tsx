import { PageHeader } from '../../components/ui';
import UserForm from '../../components/users/UserForm';
import { useCreateUser } from '../../querys/users/mutationUsers';

const UserCreateView = () => {
  const createMutation = useCreateUser();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Usuario"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Usuarios', to: '/users' },
          { label: 'Nuevo' },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <UserForm
          mode="create"
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
        />
      </div>
    </div>
  );
};

export default UserCreateView;
