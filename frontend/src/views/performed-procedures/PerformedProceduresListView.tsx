import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import PerformedProceduresTable from '../../components/performed-procedures/PerformedProceduresTable';
import { usePerformedProceduresList } from '../../querys/performed-procedures/queryPerformedProcedures';

const PerformedProceduresListView = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isPending, isError, error, refetch } = usePerformedProceduresList({ page, limit });

  const listErrorMessage =
    error instanceof HttpError
      ? typeof error.details === 'string'
        ? error.details
        : Array.isArray(error.details)
          ? error.details.join(', ')
          : error.message
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar la lista de procedimientos realizados.';

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Procedimientos realizados"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'registro' : 'registros'} en total`
              : !isError
                ? 'Historial de procedimientos clínicos'
                : undefined
          }
          breadcrumb={[
            { label: 'Inicio', to: '/' },
            { label: 'Procedimientos realizados' },
          ]}
        />
      </div>

      <div className="shrink-0 flex flex-wrap items-end justify-end gap-2">
        <Link to="/performed-procedures/new">
          <Button
            type="button"
            className="h-10 min-h-10 shrink-0 !py-0 px-4 whitespace-nowrap rounded-md"
          >
            <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo procedimiento
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {isError ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-4 rounded-md border border-red-200 bg-red-50/90 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm text-red-800 dark:text-red-200 max-w-md">{listErrorMessage}</p>
            <Button type="button" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <PerformedProceduresTable
            data={data?.data || []}
            loading={isPending && !data}
            fillHeight
            pagination={
              data && !isError && data.meta.totalItems > 0
                ? {
                    page: data.meta.page,
                    totalPages: data.meta.totalPages,
                    total: data.meta.totalItems,
                    limit: data.meta.limit,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default PerformedProceduresListView;
