import { Link } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import UsersTable from '../../components/users/UsersTable';
import { useUsersList } from '../../querys/users/queryUsers';

const UsersListView = () => {
  const { data, isLoading } = useUsersList();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administración de cuentas del sistema"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Usuarios' },
        ]}
        action={
          <Link to="/users/new">
            <Button>
              <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Usuario
            </Button>
          </Link>
        }
      />

      <UsersTable data={data || []} loading={isLoading} />
    </div>
  );
};

export default UsersListView;
