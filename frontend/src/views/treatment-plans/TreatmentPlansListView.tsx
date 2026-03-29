import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader, Button, Table, Badge, Modal } from '../../components/ui';
import type { Column } from '../../components/ui';
import { useTreatmentPlansList } from '../../querys/treatment-plans/queryTreatmentPlans';
import { useUpdateTreatmentPlanStatus, useUpdateTreatmentPlan } from '../../querys/treatment-plans/mutationTreatmentPlans';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import TreatmentPlanForm from '../../components/treatment-plans/TreatmentPlanForm';
import type { TreatmentPlan } from '../../types';
import { PLAN_STATUS_CONFIG, VALID_PLAN_STATUS_TRANSITIONS } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

const TreatmentPlansListView = () => {
  const { data, isLoading } = useTreatmentPlansList();
  const navigate = useNavigate();

  const [statusTarget, setStatusTarget] = useState<TreatmentPlan | null>(null);
  const [editTarget, setEditTarget] = useState<TreatmentPlan | null>(null);

  const statusMutation = useUpdateTreatmentPlanStatus(statusTarget?.id ?? '');
  const updatePlan = useUpdateTreatmentPlan();

  const { data: patientsData } = usePatientsList({ limit: 100 });
  const { data: doctorsData } = useDoctorsList();
  const activePatients = (patientsData?.data ?? []).filter((p) => p.isActive);
  const activeDoctors = (doctorsData ?? []).filter((d) => d.isActive);

  const columns: Column<TreatmentPlan>[] = [
    {
      key: 'patient',
      header: 'Paciente',
      render: (p) => p.patient
        ? <span className="font-medium text-slate-900 dark:text-white">{p.patient.firstName} {p.patient.lastName}</span>
        : '—',
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (p) => p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—',
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => {
        const config = PLAN_STATUS_CONFIG[p.status as TreatmentPlanStatus];
        return config ? <Badge className={config.className}>{config.label}</Badge> : null;
      },
    },
    {
      key: 'items',
      header: 'Procedimientos',
      render: (p) => `${p.items?.length || 0}`,
      hideOnMobile: true,
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      hideOnMobile: true,
      render: (p) => {
        const transitions = VALID_PLAN_STATUS_TRANSITIONS[p.status as TreatmentPlanStatus] ?? [];
        const canChangeStatus = transitions.length > 0;

        return (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ver detalle */}
            <button
              title="Ver detalle"
              onClick={() => navigate(`/treatment-plans/${p.id}`)}
              className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Cambiar estado */}
            {canChangeStatus && (
              <button
                title="Cambiar estado"
                onClick={() => setStatusTarget(p)}
                className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* Editar */}
            {canChangeStatus && (
              <button
                title="Editar plan"
                onClick={() => setEditTarget(p)}
                className="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // Transiciones válidas del plan seleccionado para cambio de estado
  const planTransitions = statusTarget
    ? (VALID_PLAN_STATUS_TRANSITIONS[statusTarget.status as TreatmentPlanStatus] ?? [])
    : [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Planes de Tratamiento"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Planes de Tratamiento' }]}
        action={
          <Link to="/treatment-plans/new">
            <Button>
              <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Plan
            </Button>
          </Link>
        }
      />

      <Table<TreatmentPlan>
        columns={columns}
        data={data || []}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => navigate(`/treatment-plans/${p.id}`)}
        loading={isLoading}
        emptyMessage="No hay planes de tratamiento"
      />

      {/* Modal cambio de estado */}
      <Modal
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        title="Cambiar estado del plan"
        size="sm"
      >
        {statusTarget && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 space-y-1">
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {statusTarget.patient
                  ? `${statusTarget.patient.firstName} ${statusTarget.patient.lastName}`
                  : '—'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {statusTarget.doctor
                  ? `Dr. ${statusTarget.doctor.firstName} ${statusTarget.doctor.lastName}`
                  : '—'}
              </p>
              <div className="pt-1">
                {(() => {
                  const cfg = PLAN_STATUS_CONFIG[statusTarget.status as TreatmentPlanStatus];
                  return cfg ? <Badge className={cfg.className}>{cfg.label}</Badge> : null;
                })()}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Cambiar a
              </p>
              <div className="flex flex-col gap-2">
                {planTransitions.map((status) => {
                  const cfg = PLAN_STATUS_CONFIG[status];
                  return (
                    <button
                      key={status}
                      disabled={statusMutation.isPending}
                      onClick={() => {
                        statusMutation.mutate(status, {
                          onSettled: () => setStatusTarget(null),
                        });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer ${
                        status === TreatmentPlanStatus.CANCELLED
                          ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20'
                          : status === TreatmentPlanStatus.COMPLETED
                          ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20'
                          : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
                      }`}
                    >
                      {cfg?.label ?? status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal editar plan */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar plan de tratamiento"
        size="sm"
      >
        {editTarget && (
          <TreatmentPlanForm
            patients={activePatients}
            doctors={activeDoctors}
            initialPatientId={editTarget.patientId}
            initialDoctorId={editTarget.doctorId}
            initialObservations={editTarget.observations}
            onSubmit={(data) => {
              updatePlan.mutate(
                { id: editTarget.id, data: { observations: data.observations } },
                { onSettled: () => setEditTarget(null) },
              );
            }}
            loading={updatePlan.isPending}
            submitLabel="Guardar cambios"
          />
        )}
      </Modal>
    </div>
  );
};

export default TreatmentPlansListView;
