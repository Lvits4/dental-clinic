import { Badge } from '../ui';
import { PLAN_STATUS_CONFIG } from '../../types';
import type { TreatmentPlanItem } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

interface TreatmentPlanItemsProps {
  items: TreatmentPlanItem[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const TreatmentPlanItems = ({ items }: TreatmentPlanItemsProps) => {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No hay procedimientos agregados.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const itemConfig = PLAN_STATUS_CONFIG[item.status as TreatmentPlanStatus] ?? {
          label: item.status,
          className: 'bg-slate-100 text-slate-600',
        };
        const performed = item.performedProcedures ?? [];
        const isCompleted = item.status === TreatmentPlanStatus.COMPLETED;

        return (
          <div
            key={item.id}
            className={`rounded-lg border p-3 transition-colors ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40'
                : 'bg-slate-50 dark:bg-slate-700/50 border-transparent'
            }`}
          >
            {/* Fila principal */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {isCompleted && (
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className={`text-sm font-medium ${isCompleted ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                    {i + 1}. {item.treatment?.name || 'Tratamiento'}
                  </span>
                  {item.tooth && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Pieza: {item.tooth}
                    </span>
                  )}
                </div>
                {item.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.notes}
                  </p>
                )}
              </div>
              <Badge className={itemConfig.className}>{itemConfig.label}</Badge>
            </div>

            {/* Procedimientos realizados vinculados */}
            {performed.length > 0 && (
              <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/40 space-y-1">
                {performed.map((pp) => (
                  <div key={pp.id} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Realizado el {formatDate(pp.performedAt)}
                      {pp.doctor && ` · Dr. ${pp.doctor.firstName} ${pp.doctor.lastName}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TreatmentPlanItems;
