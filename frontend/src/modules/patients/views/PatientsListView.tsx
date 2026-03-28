import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatientsList } from '../hooks/usePatientsList';
import PatientsTable from '../components/PatientsTable/PatientsTable';
import PatientFilters from '../components/PatientFilters/PatientFilters';
import Pagination from '../../../common/components/Pagination/Pagination';
import Button from '../../../common/components/Button/Button';

const PatientsListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data, isLoading } = usePatientsList({
    page,
    limit,
    name: search || undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pacientes</h1>
        <Link to="/patients/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Paciente
          </Button>
        </Link>
      </div>

      <PatientFilters search={search} onSearchChange={handleSearchChange} />

      <PatientsTable data={data?.data || []} loading={isLoading} />

      {data && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.totalItems}
          limit={data.meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default PatientsListView;
