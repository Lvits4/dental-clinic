import { Table, Pagination } from '../ui';
import type { Column } from '../ui';
import type { PerformedProcedure } from '../../types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface PerformedProceduresTableProps {
  data: PerformedProcedure[];
  loading?: boolean;
  fillHeight?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
}

const PerformedProceduresTable = ({
  data,
  loading,
  fillHeight = false,
  pagination,
}: PerformedProceduresTableProps) => {
  const columns: Column<PerformedProcedure>[] = [
    {
      key: 'performedAt',
      header: 'Fecha',
      render: (p) => (
        <span className="font-medium text-slate-900 dark:text-white">
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

  const rootClass = fillHeight ? 'flex flex-col flex-1 min-h-0 min-w-0 gap-2' : 'flex flex-col gap-2';

  const paginationProps = pagination
    ? { embedded: true as const, compact: true as const, ...pagination }
    : null;
  const mobileWrap = fillHeight
    ? 'md:hidden flex-1 min-h-0 overflow-y-auto space-y-2'
    : 'md:hidden space-y-2';

  return (
    <div className={rootClass}>
      <div className={mobileWrap}>
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            No hay procedimientos registrados
          </div>
        ) : (
          data.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4"
            >
              <span className="font-medium text-slate-900 dark:text-white block">
                {formatDate(p.performedAt)}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : '—'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {p.treatment?.name || '—'}
                {p.tooth ? ` · Pieza ${p.tooth}` : ''}
              </p>
            </div>
          ))
        )}
      </div>

      {paginationProps && (
        <div className="md:hidden shrink-0 rounded-md border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Pagination {...paginationProps} />
        </div>
      )}

      <div className={fillHeight ? 'hidden md:flex md:flex-1 md:min-h-0 md:flex-col min-w-0' : 'hidden md:block min-w-0'}>
        <Table<PerformedProcedure>
          columns={columns}
          data={data}
          keyExtractor={(p) => p.id}
          loading={loading}
          emptyMessage="No hay procedimientos registrados"
          fillHeight={fillHeight}
          headerVariant="sentence"
          surfaceRounding="compact"
          footer={paginationProps ? <Pagination {...paginationProps} /> : undefined}
        />
      </div>
    </div>
  );
};

export default PerformedProceduresTable;
