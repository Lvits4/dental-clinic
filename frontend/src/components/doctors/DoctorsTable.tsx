import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Badge, ConfirmDialog } from '../ui';
import type { Column } from '../ui';
import type { Doctor } from '../../types';
import { useDeleteDoctor, useActivateDoctor } from '../../querys/doctors/mutationDoctors';

interface DoctorsTableProps {
  data: Doctor[];
  loading?: boolean;
}

const DoctorsTable = ({ data, loading }: DoctorsTableProps) => {
  const navigate = useNavigate();
  const deleteDoctor = useDeleteDoctor();
  const activateDoctor = useActivateDoctor();
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [doctorToActivate, setDoctorToActivate] = useState<Doctor | null>(null);

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (d) => (
        <span className="font-medium text-slate-900 dark:text-white">
          Dr. {d.firstName} {d.lastName}
        </span>
      ),
    },
    {
      key: 'specialty',
      header: 'Especialidad',
    },
    {
      key: 'phone',
      header: 'Teléfono',
      hideOnMobile: true,
    },
    {
      key: 'email',
      header: 'Correo',
      hideOnMobile: true,
    },
    {
      key: 'licenseNumber',
      header: 'Licencia',
      hideOnMobile: true,
    },
    {
      key: 'isActive',
      header: 'Estado',
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
      className: 'text-right',
      hideOnMobile: true,
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Editar */}
          <Link to={`/doctors/${d.id}/edit`}>
            <button
              title="Editar"
              className="p-1.5 rounded-md text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </Link>
          {/* Desactivar / Activar */}
          {d.isActive ? (
            <button
              title="Desactivar"
              onClick={() => setDoctorToDelete(d)}
              className="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          ) : (
            <button
              title="Activar"
              onClick={() => setDoctorToActivate(d)}
              className="p-1.5 rounded-md text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table<Doctor>
        columns={columns}
        data={data}
        keyExtractor={(d) => d.id}
        onRowClick={(d) => navigate(`/doctors/${d.id}/edit`)}
        loading={loading}
        emptyMessage="No se encontraron doctores"
      />

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
        title="Desactivar doctor"
        message={`¿Estás seguro de que deseas desactivar a Dr. ${doctorToDelete?.firstName} ${doctorToDelete?.lastName}? El doctor no será eliminado, solo quedará inactivo.`}
        confirmLabel="Desactivar"
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
    </>
  );
};

export default DoctorsTable;
