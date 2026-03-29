import { Link, useParams } from 'react-router-dom';
import { PageHeader, Badge, Spinner } from '../../components/ui';
import TreatmentPlanItems from '../../components/treatment-plans/TreatmentPlanItems';
import { useTreatmentPlanDetail } from '../../querys/treatment-plans/queryTreatmentPlans';
import { useUpdateTreatmentPlanStatus } from '../../querys/treatment-plans/mutationTreatmentPlans';
import { PLAN_STATUS_CONFIG } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

const TreatmentPlanDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: plan, isLoading } = useTreatmentPlanDetail(id!);
  const statusMutation = useUpdateTreatmentPlanStatus(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Plan no encontrado</p>
      </div>
    );
  }

  const config = PLAN_STATUS_CONFIG[plan.status as TreatmentPlanStatus];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Plan de Tratamiento"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Planes de Tratamiento', to: '/treatment-plans' },
          { label: 'Detalle' },
        ]}
        action={config ? <Badge className={config.className}>{config.label}</Badge> : undefined}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <dl className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Paciente</dt>
            <dd className="text-sm text-slate-900 dark:text-white">
              {plan.patient
                ? <Link to={`/patients/${plan.patientId}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{plan.patient.firstName} {plan.patient.lastName}</Link>
                : '—'}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Doctor</dt>
            <dd className="text-sm text-slate-900 dark:text-white">
              {plan.doctor ? `Dr. ${plan.doctor.firstName} ${plan.doctor.lastName}` : '—'}
            </dd>
          </div>
          {plan.observations && (
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">Observaciones</dt>
              <dd className="text-sm text-slate-900 dark:text-white whitespace-pre-line">{plan.observations}</dd>
            </div>
          )}
        </dl>

        {/* Cambiar estado */}
        {plan.status !== TreatmentPlanStatus.COMPLETED && plan.status !== TreatmentPlanStatus.CANCELLED && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Cambiar estado</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PLAN_STATUS_CONFIG)
                .filter(([s]) => s !== plan.status)
                .map(([status, cfg]) => (
                  <button
                    key={status}
                    onClick={() => statusMutation.mutate(status as TreatmentPlanStatus)}
                    disabled={statusMutation.isPending}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                  >
                    {cfg.label}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Items del plan */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Procedimientos del Plan
        </h3>
        <TreatmentPlanItems items={plan.items || []} />
      </div>
    </div>
  );
};

export default TreatmentPlanDetailView;
