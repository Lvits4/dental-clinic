import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePerformedProceduresList } from '../hooks/usePerformedProcedures';
import Table, { type Column } from '../../../common/components/Table/Table';
import Pagination from '../../../common/components/Pagination/Pagination';
import Button from '../../../common/components/Button/Button';
import type { PerformedProcedure } from '../types/performed-procedure.types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

const PerformedProceduresListView = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = usePerformedProceduresList({ page, limit });

  const columns: Column<PerformedProcedure>[] = [
    {
      key: 'performedAt',
      header: 'Fecha',
      render: (p) => <span className="font-medium text-gray-900 dark:text-white">{formatDate(p.performedAt)}</span>,
    },
    { key: 'patient', header: 'Paciente', render: (p) => p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : '—' },
    { key: 'doctor', header: 'Doctor', render: (p) => p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—' },
    { key: 'treatment', header: 'Tratamiento', render: (p) => p.treatment?.name || '—' },
    { key: 'tooth', header: 'Pieza', render: (p) => p.tooth || '—' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procedimientos Realizados</h1>
        <Link to="/performed-procedures/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Procedimiento
          </Button>
        </Link>
      </div>
      <Table<PerformedProcedure> columns={columns} data={data?.data || []} keyExtractor={(p) => p.id} loading={isLoading} emptyMessage="No hay procedimientos registrados" />
      {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.totalItems} limit={data.meta.limit} onPageChange={setPage} />}
    </div>
  );
};

export default PerformedProceduresListView;
