import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Table, Badge, Modal } from '../../components/ui';
import type { Column } from '../../components/ui';
import { useTreatmentPlansList } from '../../querys/treatment-plans/queryTreatmentPlans';
import { useUpdateTreatmentPlanStatus, useUpdateTreatmentPlan } from '../../querys/treatment-plans/mutationTreatmentPlans';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import TreatmentPlanForm from '../../components/treatment-plans/TreatmentPlanForm';
import type { TreatmentPlan } from '../../types';
import { PLAN_STATUS_CONFIG } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

// Colores semánticos por estado de plan
const PLAN_STATUS_BUTTON_CLASSES: Record<string, string> = {
  [TreatmentPlanStatus.PENDING]:     'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
  [TreatmentPlanStatus.IN_PROGRESS]: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  [TreatmentPlanStatus.COMPLETED]:   'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  [TreatmentPlanStatus.CANCELLED]:   'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
};

const TreatmentPlansListView = () => {
  const { data, isLoading } = useTreatmentPlansList();

  const [editTarget, setEditTarget] = useState<TreatmentPlan | null>(null);

  const updateStatus = useUpdateTreatmentPlanStatus(editTarget?.id ?? '');
  const updatePlan   = useUpdateTreatmentPlan();

  const { data: patientsData } = usePatientsList({ limit: 100 });
  const { data: doctorsData }  = useDoctorsList();
  const activePatients = (patientsData?.data ?? []).filter((p) => p.isActive);
  const activeDoctors  = (doctorsData ?? []).filter((d) => d.isActive);

  // Todos los estados posibles excepto el actual del plan en edición
  const allStatusesExceptCurrent = editTarget
    ? Object.values(TreatmentPlanStatus).filter((s) => s !== editTarget.status)
    : [];

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
      render: (p) => (
        <div
          className="flex items-center justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            title="Editar plan"
            onClick={() => setEditTarget(p)}
            className="p-2 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

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
        loading={isLoading}
        emptyMessage="No hay planes de tratamiento"
      />

      {/* Modal editar plan */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar plan de tratamiento"
        size="md"
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
            footerContent={
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-1">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Estado actual
                  </p>
                  {(() => {
                    const cfg = PLAN_STATUS_CONFIG[editTarget.status as TreatmentPlanStatus];
                    return cfg ? <Badge className={cfg.className}>{cfg.label}</Badge> : null;
                  })()}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                  Cambiar a:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allStatusesExceptCurrent.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate(status, {
                          onSuccess: () => {
                            setEditTarget((prev) => prev ? { ...prev, status } : null);
                          },
                        })
                      }
                      className={[
                        'px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer',
                        PLAN_STATUS_BUTTON_CLASSES[status] ?? 'border-slate-300 text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {PLAN_STATUS_CONFIG[status]?.label ?? status}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default TreatmentPlansListView;
