import { useState } from 'react';
import { Table, ConfirmDialog, Pagination } from '../ui';
import type { Column } from '../ui';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import AppointmentFormModal from './AppointmentFormModal';
import type { Appointment, AppointmentSortBy, AppointmentSortOrder } from '../../types';
import { useDeleteAppointment } from '../../querys/appointments/mutationAppointments';

interface AppointmentsTableProps {
  data: Appointment[];
  loading?: boolean;
  fillHeight?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
  /** Si se define, la edición la abre el padre (p. ej. lista con un solo modal) */
  onEditRequest?: (appointment: Appointment) => void;
  showEdit?: boolean;
  sortColumn?: AppointmentSortBy | null;
  sortDirection?: AppointmentSortOrder;
  onSort?: (sortKey: string) => void;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TrashIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const AppointmentsTable = ({
  data,
  loading,
  fillHeight = false,
  pagination,
  onEditRequest,
  showEdit = true,
  sortColumn,
  sortDirection = 'asc',
  onSort,
}: AppointmentsTableProps) => {
  const deleteAppointment = useDeleteAppointment();
  const [internalEdit, setInternalEdit] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  const openEdit = (a: Appointment) => {
    if (onEditRequest) onEditRequest(a);
    else setInternalEdit(a);
  };

  const editModalOpen = !onEditRequest && !!internalEdit;

  const actionButtons = (a: Appointment) => (
    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {showEdit && (
        <button
          type="button"
          title="Editar cita"
          onClick={() => openEdit(a)}
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
      )}
      <button
        type="button"
        title="Eliminar cita"
        onClick={() => setAppointmentToDelete(a)}
        className="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
      >
        <TrashIcon />
      </button>
    </div>
  );

  const columns: Column<Appointment>[] = [
    {
      key: 'dateTime',
      header: 'Fecha / Hora',
      sortKey: 'dateTime',
      render: (a) => (
        <span className="font-medium text-slate-900 dark:text-white">{formatDateTime(a.dateTime)}</span>
      ),
    },
    {
      key: 'patient',
      header: 'Paciente',
      sortKey: 'patientName',
      className: 'max-w-[11rem] min-w-0',
      render: (a) => {
        const name = a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : '—';
        return (
          <span className="font-medium text-slate-900 dark:text-white block truncate" title={name}>
            {name}
          </span>
        );
      },
    },
    {
      key: 'doctor',
      header: 'Doctor',
      sortKey: 'doctorName',
      render: (a) => (a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : '—'),
      hideOnMobile: true,
    },
    {
      key: 'reason',
      header: 'Motivo',
      sortKey: 'reason',
      className: 'max-w-[14rem] min-w-0',
      render: (a) => (
        <span className="block truncate" title={a.reason || undefined}>
          {a.reason || '—'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'durationMinutes',
      header: 'Duración',
      sortKey: 'durationMinutes',
      render: (a) => `${a.durationMinutes} min`,
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Estado',
      sortKey: 'status',
      render: (a) => <AppointmentStatusBadge status={a.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-center w-[9.5rem]',
      hideOnMobile: true,
      render: (a) => actionButtons(a),
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
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">No se encontraron citas</div>
        ) : (
          data.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <button
                type="button"
                onClick={() => onEditRequest?.(a)}
                className="w-full text-left mb-3"
              >
                <span className="font-medium text-slate-900 dark:text-white block">
                  {formatDateTime(a.dateTime)}
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : '—'}
                </p>
                {a.reason && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 truncate mt-0.5">{a.reason}</p>
                )}
                <div className="mt-2">
                  <AppointmentStatusBadge status={a.status} />
                </div>
              </button>
              <div className="flex justify-center pt-2 border-t border-slate-100 dark:border-slate-700">
                {actionButtons(a)}
              </div>
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
        <Table<Appointment>
          columns={columns}
          data={data}
          keyExtractor={(a) => a.id}
          onRowClick={onEditRequest ? (a) => onEditRequest(a) : undefined}
          loading={loading}
          emptyMessage="No se encontraron citas"
          sortColumn={sortColumn ?? undefined}
          sortDirection={sortDirection}
          onSort={onSort}
          fillHeight={fillHeight}
          headerVariant="sentence"
          surfaceRounding="compact"
          footer={paginationProps ? <Pagination {...paginationProps} /> : undefined}
        />
      </div>

      {editModalOpen && internalEdit && (
        <AppointmentFormModal
          mode="edit"
          isOpen
          appointment={internalEdit}
          onClose={() => setInternalEdit(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={() => {
          if (appointmentToDelete) {
            deleteAppointment.mutate(appointmentToDelete.id, {
              onSettled: () => setAppointmentToDelete(null),
            });
          }
        }}
        title="Eliminar cita"
        message={
          appointmentToDelete
            ? `¿Eliminar definitivamente la cita del ${formatDateTime(appointmentToDelete.dateTime)}${
                appointmentToDelete.patient
                  ? ` (${appointmentToDelete.patient.firstName} ${appointmentToDelete.patient.lastName})`
                  : ''
              }? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleteAppointment.isPending}
      />
    </div>
  );
};

export default AppointmentsTable;
