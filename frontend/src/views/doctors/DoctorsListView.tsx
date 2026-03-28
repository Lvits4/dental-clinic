import { Link } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import DoctorsTable from '../../components/doctors/DoctorsTable';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';

const DoctorsListView = () => {
  const { data, isLoading } = useDoctorsList();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Doctores"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Doctores' }]}
        action={
          <Link to="/doctors/new">
            <Button>
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Doctor
            </Button>
          </Link>
        }
      />

      <DoctorsTable data={data || []} loading={isLoading} />
    </div>
  );
};

export default DoctorsListView;
