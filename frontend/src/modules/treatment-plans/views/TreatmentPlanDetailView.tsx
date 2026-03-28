import { Link, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTreatmentPlanDetail } from '../hooks/useTreatmentPlans';
import { treatmentPlansApi } from '../requests/treatment-plans.api';
import { PLAN_STATUS_CONFIG, TreatmentPlanStatus } from '../types/treatment-plan.types';
import Badge from '../../../common/components/Badge/Badge';
import Button from '../../../common/components/Button/Button';
import Spinner from '../../../common/components/Spinner/Spinner';

const TreatmentPlanDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: plan, isLoading } = useTreatmentPlanDetail(id!);
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status: TreatmentPlanStatus) => treatmentPlansApi.update(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', id] });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast.success('Estado actualizado');
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (!plan) return <div className="text-center py-12"><p className="text-gray-500 dark:text-gray-400">Plan no encontrado</p></div>;

  const config = PLAN_STATUS_CONFIG[plan.status];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link to="/treatment-plans" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan de Tratamiento</h1>
        </div>
        <Badge className={config.className}>{config.label}</Badge>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
        <dl className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Paciente</dt>
            <dd className="text-sm text-gray-900 dark:text-white">
              {plan.patient ? <Link to={`/patients/${plan.patientId}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{plan.patient.firstName} {plan.patient.lastName}</Link> : '—'}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Doctor</dt>
            <dd className="text-sm text-gray-900 dark:text-white">{plan.doctor ? `Dr. ${plan.doctor.firstName} ${plan.doctor.lastName}` : '—'}</dd>
          </div>
          {plan.observations && (
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">Observaciones</dt>
              <dd className="text-sm text-gray-900 dark:text-white whitespace-pre-line">{plan.observations}</dd>
            </div>
          )}
        </dl>

        {/* Cambiar estado */}
        {plan.status !== TreatmentPlanStatus.COMPLETED && plan.status !== TreatmentPlanStatus.CANCELLED && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Cambiar estado</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PLAN_STATUS_CONFIG).filter(([s]) => s !== plan.status).map(([status, cfg]) => (
                <button
                  key={status}
                  onClick={() => statusMutation.mutate(status as TreatmentPlanStatus)}
                  disabled={statusMutation.isPending}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items del plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Procedimientos del Plan</h3>
        {(!plan.items || plan.items.length === 0) ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No hay procedimientos agregados.</p>
        ) : (
          <div className="space-y-2">
            {plan.items.map((item, i) => {
              const itemConfig = PLAN_STATUS_CONFIG[item.status];
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {i + 1}. {item.treatment?.name || 'Tratamiento'}
                    </span>
                    {item.tooth && <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Pieza: {item.tooth}</span>}
                    {item.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.notes}</p>}
                  </div>
                  <Badge className={itemConfig.className}>{itemConfig.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPlanDetailView;
