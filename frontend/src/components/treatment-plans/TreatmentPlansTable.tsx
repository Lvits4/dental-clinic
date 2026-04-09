import { Table, Badge, Pagination } from '../ui';
import type { Column } from '../ui';
import type { TreatmentPlan, TreatmentPlanSortBy, TreatmentPlanSortOrder } from '../../types';
import { PLAN_STATUS_CONFIG } from '../../types';
import { TreatmentPlanStatus } from '../../enums';
import { countPerformedProceduresOnPlan } from '../../utils/treatmentPlans';

const TrashIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

interface TreatmentPlansTableProps {
  data: TreatmentPlan[];
  loading?: boolean;
  fillHeight?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    minLimit?: number;
    maxLimit?: number;
  };
  onViewPlan: (plan: TreatmentPlan) => void;
  onEditPlan: (plan: TreatmentPlan) => void;
  onDeletePlan: (plan: TreatmentPlan) => void;
  sortColumn?: TreatmentPlanSortBy | null;
  sortDirection?: TreatmentPlanSortOrder;
  onSort?: (sortKey: string) => void;
}

const TreatmentPlansTable = ({
  data,
  loading,
  fillHeight = false,
  pagination,
  onViewPlan,
  onEditPlan,
  onDeletePlan,
  sortColumn,
  sortDirection = 'asc',
  onSort,
}: TreatmentPlansTableProps) => {
  const actionButtons = (p: TreatmentPlan) => (
    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Ver plan"
        onClick={() => onViewPlan(p)}
        className="p-1.5 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
      >
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      <button
        type="button"
        title="Editar plan"
        onClick={() => onEditPlan(p)}
        className="p-1.5 rounded-md text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 transition-colors"
      >
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Eliminar plan"
        onClick={() => onDeletePlan(p)}
        className="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
      >
        <TrashIcon />
      </button>
    </div>
  );

  const columns: Column<TreatmentPlan>[] = [
    {
      key: 'patient',
      header: 'Paciente',
      sortKey: 'patient',
      render: (p) =>
        p.patient ? (
          <span className="font-medium text-slate-900 dark:text-white">
            {p.patient.firstName} {p.patient.lastName}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'doctor',
      header: 'Doctor',
      sortKey: 'doctor',
      render: (p) => (p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—'),
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Estado',
      sortKey: 'status',
      render: (p) => {
        const config = PLAN_STATUS_CONFIG[p.status as TreatmentPlanStatus];
        return config ? <Badge className={config.className}>{config.label}</Badge> : null;
      },
    },
    {
      key: 'items',
      header: 'Proc. realizados',
      sortKey: 'items',
      render: (p) => `${countPerformedProceduresOnPlan(p)}`,
      hideOnMobile: true,
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-center w-[12rem]',
      hideOnMobile: true,
      render: (p) => actionButtons(p),
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
            No hay planes de tratamiento
          </div>
        ) : (
          data.map((p) => {
            const cfg = PLAN_STATUS_CONFIG[p.status as TreatmentPlanStatus];
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="mb-3">
                  <span className="font-medium text-slate-900 dark:text-white block">
                    {p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : '—'}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—'}
                  </p>
                  {cfg ? (
                    <div className="mt-2">
                      <Badge className={cfg.className}>{cfg.label}</Badge>
                    </div>
                  ) : null}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Proc. realizados: {countPerformedProceduresOnPlan(p)}
                  </p>
                </div>
                <div className="flex justify-center pt-2 border-t border-slate-100 dark:border-slate-700">
                  {actionButtons(p)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {paginationProps && (
        <div className="md:hidden shrink-0 rounded-md border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Pagination {...paginationProps} />
        </div>
      )}

      <div className={fillHeight ? 'hidden md:flex md:flex-1 md:min-h-0 md:flex-col min-w-0' : 'hidden md:block min-w-0'}>
        <Table<TreatmentPlan>
          columns={columns}
          data={data}
          keyExtractor={(p) => p.id}
          loading={loading}
          emptyMessage="No hay planes de tratamiento"
          fillHeight={fillHeight}
          headerVariant="sentence"
          surfaceRounding="compact"
          sortColumn={sortColumn ?? undefined}
          sortDirection={sortDirection}
          onSort={onSort}
          footer={paginationProps ? <Pagination {...paginationProps} /> : undefined}
        />
      </div>
    </div>
  );
};

export default TreatmentPlansTable;
