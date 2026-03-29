import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Badge, ConfirmDialog } from '../ui';
import type { Column } from '../ui';
import type { Patient } from '../../types';
import { useDeletePatient, useActivatePatient } from '../../querys/patients/mutationPatients';

interface PatientsTableProps {
  data: Patient[];
  loading?: boolean;
}

const SEX_LABELS: Record<string, string> = {
  male: 'M',
  female: 'F',
  other: 'Otro',
};

const PatientsTable = ({ data, loading }: PatientsTableProps) => {
  const navigate = useNavigate();
  const deletePatient = useDeletePatient();
  const activatePatient = useActivatePatient();
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [patientToActivate, setPatientToActivate] = useState<Patient | null>(null);

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (p) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {p.firstName} {p.lastName}
        </span>
      ),
    },
    {
      key: 'sex',
      header: 'Sexo',
      render: (p) => SEX_LABELS[p.sex] || p.sex,
    },
    {
      key: 'phone',
      header: 'Telefono',
    },
    {
      key: 'email',
      header: 'Correo',
      render: (p) => p.email || '—',
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (p) => (
        <Badge
          className={
            p.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {p.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      hideOnMobile: true,
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Ver detalle */}
          <Link to={`/patients/${p.id}`}>
            <button
              title="Ver detalle"
              className="p-1.5 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </Link>
          {/* Editar */}
          <Link to={`/patients/${p.id}/edit`}>
            <button
              title="Editar"
              className="p-1.5 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </Link>
          {/* Desactivar / Activar */}
          {p.isActive ? (
            <button
              title="Desactivar"
              onClick={() => setPatientToDelete(p)}
              className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          ) : (
            <button
              title="Activar"
              onClick={() => setPatientToActivate(p)}
              className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors"
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

  // Vista mobile: cards
  if (typeof window !== 'undefined' && window.innerWidth < 640) {
    return (
      <div className="space-y-2 sm:hidden">
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            Cargando...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            No se encontraron pacientes
          </div>
        ) : (
          data.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-900 dark:text-white">
                  {p.firstName} {p.lastName}
                </span>
                <Badge
                  className={
                    p.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }
                >
                  {p.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{p.phone}</p>
              {p.email && (
                <p className="text-sm text-slate-400 dark:text-slate-500 truncate">{p.email}</p>
              )}
            </button>
          ))
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">No se encontraron pacientes</div>
        ) : (
          data.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-900 dark:text-white">
                  {p.firstName} {p.lastName}
                </span>
                <Badge
                  className={
                    p.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }
                >
                  {p.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{p.phone}</p>
              {p.email && (
                <p className="text-sm text-slate-400 dark:text-slate-500 truncate">{p.email}</p>
              )}
            </button>
          ))
        )}
      </div>

      {/* Desktop tabla */}
      <div className="hidden sm:block">
        <Table<Patient>
          columns={columns}
          data={data}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => navigate(`/patients/${p.id}`)}
          loading={loading}
          emptyMessage="No se encontraron pacientes"
        />
      </div>

      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={() => {
          if (patientToDelete) {
            deletePatient.mutate(patientToDelete.id, {
              onSettled: () => setPatientToDelete(null),
            });
          }
        }}
        title="Desactivar paciente"
        message={`¿Estás seguro de que deseas desactivar a ${patientToDelete?.firstName} ${patientToDelete?.lastName}? El paciente no será eliminado, solo quedará inactivo.`}
        confirmLabel="Desactivar"
        variant="danger"
        loading={deletePatient.isPending}
      />

      <ConfirmDialog
        isOpen={!!patientToActivate}
        onClose={() => setPatientToActivate(null)}
        onConfirm={() => {
          if (patientToActivate) {
            activatePatient.mutate(patientToActivate.id, {
              onSettled: () => setPatientToActivate(null),
            });
          }
        }}
        title="Activar paciente"
        message={`¿Deseas activar nuevamente a ${patientToActivate?.firstName} ${patientToActivate?.lastName}?`}
        confirmLabel="Activar"
        variant="primary"
        loading={activatePatient.isPending}
      />
    </>
  );
};

export default PatientsTable;
