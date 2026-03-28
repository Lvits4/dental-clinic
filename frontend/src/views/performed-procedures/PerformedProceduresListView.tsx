import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Table, Pagination } from '../../components/ui';
import type { Column } from '../../components/ui';
import { usePerformedProceduresList } from '../../querys/performed-procedures/queryPerformedProcedures';
import type { PerformedProcedure } from '../../types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const PerformedProceduresListView = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = usePerformedProceduresList({ page, limit });

  const columns: Column<PerformedProcedure>[] = [
    {
      key: 'performedAt',
      header: 'Fecha',
      render: (p) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatDate(p.performedAt)}
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'Paciente',
      render: (p) =>
        p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : '—',
    },
    {
      key: 'doctor',
      header: 'Doctor',
      hideOnMobile: true,
      render: (p) =>
        p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—',
    },
    {
      key: 'treatment',
      header: 'Tratamiento',
      hideOnMobile: true,
      render: (p) => p.treatment?.name || '—',
    },
    {
      key: 'tooth',
      header: 'Pieza',
      render: (p) => p.tooth || '—',
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Procedimientos Realizados"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Procedimientos Realizados' },
        ]}
        action={
          <Link to="/performed-procedures/new">
            <Button>
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Procedimiento
            </Button>
          </Link>
        }
      />

      <Table<PerformedProcedure>
        columns={columns}
        data={data?.data || []}
        keyExtractor={(p) => p.id}
        loading={isLoading}
        emptyMessage="No hay procedimientos registrados"
      />

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

export default PerformedProceduresListView;
