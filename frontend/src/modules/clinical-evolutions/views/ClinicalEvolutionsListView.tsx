import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useClinicalEvolutionsList } from '../hooks/useClinicalEvolutions';
import { useClinicalRecord } from '../../clinical-records/hooks/useClinicalRecord';
import Table, { type Column } from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/feedback/Spinner';
import type { ClinicalEvolution } from '../types/clinical-evolution.types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ClinicalEvolutionsListView() {
  const { id: patientId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId!);
  const { data, isLoading } = useClinicalEvolutionsList({
    page,
    limit,
    recordId: record?.id,
  });

  if (loadingRecord) return <div className="flex justify-center py-12"><Spinner /></div>;

  const columns: Column<ClinicalEvolution>[] = [
    {
      key: 'date',
      header: 'Fecha',
      render: (e) => <span className="font-medium text-gray-900 dark:text-white">{formatDate(e.date)}</span>,
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (e) => e.doctor ? `Dr. ${e.doctor.firstName} ${e.doctor.lastName}` : '—',
    },
    { key: 'consultationReason', header: 'Motivo' },
    { key: 'diagnosis', header: 'Diagnóstico' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link to={`/patients/${patientId}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Evoluciones Clínicas</h1>
        </div>
        {record && (
          <Link to={`/patients/${patientId}/evolutions/new`}>
            <Button>
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Evolución
            </Button>
          </Link>
        )}
      </div>

      {!record ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Debe crear el expediente clínico primero.</p>
          <Link to={`/patients/${patientId}/clinical-record`} className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm mt-2 inline-block">
            Ir al expediente
          </Link>
        </div>
      ) : (
        <>
          <Table<ClinicalEvolution>
            columns={columns}
            data={data?.data || []}
            keyExtractor={(e) => e.id}
            onRowClick={(e) => {/* navigate to detail if needed */}}
            loading={isLoading}
            emptyMessage="No hay evoluciones registradas"
          />
          {data && (
            <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
