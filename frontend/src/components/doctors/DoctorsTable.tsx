import { useState } from 'react';
import { Table, Badge, ConfirmDialog, Pagination } from '../ui';
import type { Column } from '../ui';
import type { Doctor, DoctorSortBy, DoctorSortOrder } from '../../types';
import { useDeleteDoctor, useActivateDoctor } from '../../querys/doctors/mutationDoctors';

const TrashIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

interface DoctorsTableProps {
  data: Doctor[];
  loading?: boolean;
  onEditDoctor: (doctor: Doctor) => void;
  sortColumn?: DoctorSortBy | null;
  sortDirection?: DoctorSortOrder;
  onSort?: (sortKey: string) => void;
  fillHeight?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  };
}

const DoctorsTable = ({
  data,
  loading,
  onEditDoctor,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  fillHeight = false,
  pagination,
}: DoctorsTableProps) => {
  const deleteDoctor = useDeleteDoctor();
  const activateDoctor = useActivateDoctor();
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [doctorToActivate, setDoctorToActivate] = useState<Doctor | null>(null);

  const actionButtons = (d: Doctor) => (
    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Editar"
        onClick={() => onEditDoctor(d)}
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
      {d.isActive ? (
        <button
          type="button"
          title="Eliminar de la lista"
          onClick={() => setDoctorToDelete(d)}
          className="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
        >
          <TrashIcon />
        </button>
      ) : (
        <button
          type="button"
          title="Activar"
          onClick={() => setDoctorToActivate(d)}
          className="p-1.5 rounded-md text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors"
        >
          <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
        </button>
      )}
    </div>
  );

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Nombre',
      sortKey: 'name',
      render: (d) => (
        <span className="font-medium text-slate-900 dark:text-white">
          Dr. {d.firstName} {d.lastName}
        </span>
      ),
    },
    {
      key: 'specialty',
      header: 'Especialidad',
      sortKey: 'specialty',
    },
    {
      key: 'phone',
      header: 'Teléfono',
      sortKey: 'phone',
      hideOnMobile: true,
    },
    {
      key: 'email',
      header: 'Correo',
      sortKey: 'email',
      hideOnMobile: true,
    },
    {
      key: 'licenseNumber',
      header: 'Licencia',
      sortKey: 'licenseNumber',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Estado',
      sortKey: 'isActive',
      render: (d) => (
        <Badge
          className={
            d.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {d.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-center w-[7.5rem]',
      hideOnMobile: true,
      render: (d) => actionButtons(d),
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
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">No se encontraron doctores</div>
        ) : (
          data.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <button
                type="button"
                onClick={() => onEditDoctor(d)}
                className="w-full text-left mb-3"
              >
                <span className="font-medium text-slate-900 dark:text-white block">
                  Dr. {d.firstName} {d.lastName}
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{d.specialty}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 truncate">{d.phone}</p>
              </button>
              <div className="flex justify-center pt-2 border-t border-slate-100 dark:border-slate-700">
                {actionButtons(d)}
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
        <Table<Doctor>
          columns={columns}
          data={data}
          keyExtractor={(d) => d.id}
          onRowClick={onEditDoctor}
          loading={loading}
          emptyMessage="No se encontraron doctores"
          sortColumn={sortColumn ?? undefined}
          sortDirection={sortDirection}
          onSort={onSort}
          fillHeight={fillHeight}
          headerVariant="sentence"
          surfaceRounding="compact"
          footer={paginationProps ? <Pagination {...paginationProps} /> : undefined}
        />
      </div>

      <ConfirmDialog
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={() => {
          if (doctorToDelete) {
            deleteDoctor.mutate(doctorToDelete.id, {
              onSettled: () => setDoctorToDelete(null),
            });
          }
        }}
        title="Eliminar doctor"
        message={`¿Eliminar a Dr. ${doctorToDelete?.firstName} ${doctorToDelete?.lastName}? Pasará a inactivo y dejará de mostrarse en la lista principal.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleteDoctor.isPending}
      />

      <ConfirmDialog
        isOpen={!!doctorToActivate}
        onClose={() => setDoctorToActivate(null)}
        onConfirm={() => {
          if (doctorToActivate) {
            activateDoctor.mutate(doctorToActivate.id, {
              onSettled: () => setDoctorToActivate(null),
            });
          }
        }}
        title="Activar doctor"
        message={`¿Deseas activar nuevamente a Dr. ${doctorToActivate?.firstName} ${doctorToActivate?.lastName}?`}
        confirmLabel="Activar"
        variant="primary"
        loading={activateDoctor.isPending}
      />
    </div>
  );
};

export default DoctorsTable;
