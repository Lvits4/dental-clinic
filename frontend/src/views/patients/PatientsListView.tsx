import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, PageHeader, Pagination } from '../../components/ui';
import PatientsTable from '../../components/patients/PatientsTable';
import PatientFilters from '../../components/patients/PatientFilters';
import { usePatientsList } from '../../querys/patients/queryPatients';

const PatientsListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  const { data, isLoading } = usePatientsList({
    page,
    limit,
    name: search || undefined,
    isActive: statusFilter !== '' ? statusFilter === 'true' : undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pacientes"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Pacientes' }]}
        action={
          <Link to="/patients/new">
            <Button>
              <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Paciente
            </Button>
          </Link>
        }
      />

      <PatientFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusChange}
      />

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
