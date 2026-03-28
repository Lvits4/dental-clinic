import { Link } from 'react-router-dom';
import { useDoctorsList } from '../hooks/useDoctorsList';
import DoctorsTable from '../components/DoctorsTable';
import Button from '../../../shared/components/ui/Button';

export default function DoctorsListView() {
  const { data, isLoading } = useDoctorsList();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctores</h1>
        <Link to="/doctors/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Doctor
          </Button>
        </Link>
      </div>

      <DoctorsTable data={data || []} loading={isLoading} />
    </div>
  );
}
