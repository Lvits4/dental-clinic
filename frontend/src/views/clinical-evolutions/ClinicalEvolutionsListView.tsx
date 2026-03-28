import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader, Button, Spinner } from '../../components/ui';
import ClinicalEvolutionCard from '../../components/clinical-evolutions/ClinicalEvolutionCard';
import { useClinicalEvolutionsList } from '../../querys/clinical-evolutions/queryClinicalEvolutions';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { Pagination } from '../../components/ui';

const ClinicalEvolutionsListView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId!);
  const { data, isLoading } = useClinicalEvolutionsList({
    page,
    limit,
    recordId: record?.id,
  });

  if (loadingRecord) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Evoluciones Clínicas"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Pacientes', to: '/patients' },
          { label: 'Paciente', to: `/patients/${patientId}` },
          { label: 'Evoluciones' },
        ]}
        action={
          record ? (
            <Link to={`/patients/${patientId}/evolutions/new`}>
              <Button>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Evolución
              </Button>
            </Link>
          ) : undefined
        }
      />

      {!record ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Debe crear el expediente clínico primero.
          </p>
          <Link
            to={`/patients/${patientId}/clinical-record`}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm mt-2 inline-block"
          >
            Ir al expediente
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !data?.data?.length ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No hay evoluciones registradas.</p>
        </div>
      ) : (
        <>
          {/* Timeline de evoluciones */}
          <div className="relative space-y-4 pl-4 sm:pl-6">
            {/* Línea vertical */}
            <div className="absolute left-1 sm:left-2 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />

            {data.data.map((evolution) => (
              <div key={evolution.id} className="relative">
                {/* Punto en la línea */}
                <div className="absolute -left-3 sm:-left-4 top-5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                <ClinicalEvolutionCard evolution={evolution} />
              </div>
            ))}
          </div>

          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.totalItems}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default ClinicalEvolutionsListView;
