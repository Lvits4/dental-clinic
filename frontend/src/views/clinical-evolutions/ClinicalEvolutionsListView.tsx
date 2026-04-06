import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader, Button, Spinner, DatePicker } from '../../components/ui';
import ClinicalEvolutionCard from '../../components/clinical-evolutions/ClinicalEvolutionCard';
import { useClinicalEvolutionsList } from '../../querys/clinical-evolutions/queryClinicalEvolutions';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { Pagination } from '../../components/ui';
import { totalPagesFromMeta } from '../../utils/pagination';
import { DEFAULT_LIST_PAGE_SIZE, LIST_PAGE_SIZE_MAX } from '../../constants/pagination';

const ClinicalEvolutionsListView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [limit, setLimit] = useState(DEFAULT_LIST_PAGE_SIZE);

  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId!);
  const { data, isLoading } = useClinicalEvolutionsList({
    page,
    limit,
    recordId: record?.id,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const hasDateFilters = !!(dateFrom || dateTo);

  const resetDateFilters = () => {
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  useEffect(() => {
    if (!data?.meta) return;
    const tp = totalPagesFromMeta(data.meta, limit);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta, limit]);

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
            <Link to={`/patients/${patientId}/evolutions/new`} viewTransition className="block w-full sm:inline-block sm:w-auto">
              <Button className="w-full sm:w-auto">
                <svg className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Evolución
              </Button>
            </Link>
          ) : undefined
        }
      />

      {!record ? (
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Debe crear el expediente clínico primero.
          </p>
          <Link
            to={`/patients/${patientId}/clinical-record`}
            viewTransition
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm mt-2 inline-block"
          >
            Ir al expediente
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (data?.meta?.totalItems ?? 0) === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-8 text-center space-y-3">
          <p className="text-slate-500 dark:text-slate-400">
            {hasDateFilters
              ? 'No hay evoluciones en el rango de fechas seleccionado.'
              : 'No hay evoluciones registradas.'}
          </p>
          {hasDateFilters && (
            <button
              type="button"
              onClick={resetDateFilters}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Quitar filtro de fechas
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 sm:p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 sm:mb-3">Filtrar por fecha</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DatePicker
                label="Desde"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                placeholder="Fecha inicial"
              />
              <DatePicker
                label="Hasta"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                placeholder="Fecha final"
                {...(dateFrom ? { min: dateFrom } : {})}
              />
            </div>
            {hasDateFilters && (
              <button
                type="button"
                onClick={resetDateFilters}
                className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Limpiar fechas
              </button>
            )}
          </div>

          {data && data.data.length > 0 ? (
            <div className="relative space-y-4 pl-4 sm:pl-6">
              <div className="absolute left-1 sm:left-2 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />
              {data.data.map((evolution) => (
                <div key={evolution.id} className="relative">
                  <div className="absolute -left-3 sm:-left-4 top-5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  <ClinicalEvolutionCard evolution={evolution} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
              No hay resultados en esta página. Use la paginación para ir a otra página.
            </p>
          )}

          {data?.meta ? (
            <Pagination
              page={page}
              totalPages={totalPagesFromMeta(data.meta, limit)}
              total={data.meta.totalItems}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(n) => {
                setLimit(n);
                setPage(1);
              }}
              minLimit={1}
              maxLimit={LIST_PAGE_SIZE_MAX}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default ClinicalEvolutionsListView;
