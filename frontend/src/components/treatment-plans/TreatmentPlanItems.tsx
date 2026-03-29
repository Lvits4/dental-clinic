import { Badge } from '../ui';
import { PLAN_STATUS_CONFIG } from '../../types';
import type { TreatmentPlanItem } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

interface TreatmentPlanItemsProps {
  items: TreatmentPlanItem[];
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
        const itemConfig = PLAN_STATUS_CONFIG[item.status as TreatmentPlanStatus];
        return (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {i + 1}. {item.treatment?.name || 'Tratamiento'}
              </span>
              {item.tooth && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                  Pieza: {item.tooth}
                </span>
              )}
              {item.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {item.notes}
                </p>
              )}
            </div>
            {itemConfig && (
              <Badge className={itemConfig.className}>{itemConfig.label}</Badge>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TreatmentPlanItems;
