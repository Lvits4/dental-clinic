import type { ReactNode } from 'react';

type StatCardColor = 'emerald' | 'blue' | 'purple' | 'red' | 'yellow' | 'gray';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: StatCardColor;
  /** Tarjeta más densa (p. ej. fila de KPI en dashboard) */
  compact?: boolean;
  /** Con `compact`: icono arriba, texto centrado; tarjeta más estrecha y alta */
  stacked?: boolean;
}

const COLOR_MAP: Record<StatCardColor, { card: string; iconBg: string; iconText: string; valueText: string }> = {
  emerald: {
    card: 'border-emerald-100 dark:border-emerald-900/30',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/20',
    iconText: 'text-white',
    valueText: 'text-emerald-700 dark:text-emerald-400',
  },
  blue: {
    card: 'border-blue-100 dark:border-blue-900/30',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/20',
    iconText: 'text-white',
    valueText: 'text-blue-700 dark:text-blue-400',
  },
  purple: {
    card: 'border-purple-100 dark:border-purple-900/30',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm shadow-purple-500/20',
    iconText: 'text-white',
    valueText: 'text-purple-700 dark:text-purple-400',
  },
  red: {
    card: 'border-red-100 dark:border-red-900/30',
    iconBg: 'bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-500/20',
    iconText: 'text-white',
    valueText: 'text-red-700 dark:text-red-400',
  },
  yellow: {
    card: 'border-amber-100 dark:border-amber-900/30',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-500/20',
    iconText: 'text-white',
    valueText: 'text-amber-700 dark:text-amber-400',
  },
  gray: {
    card: 'border-slate-200 dark:border-slate-700',
    iconBg: 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-sm shadow-slate-400/20',
    iconText: 'text-white',
    valueText: 'text-slate-700 dark:text-slate-400',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'emerald',
  compact = false,
  stacked = false,
}: StatCardProps) => {
  const colors = COLOR_MAP[color];
  const useStacked = compact && stacked;

  if (useStacked) {
    return (
      <div
        className={[
          'group flex h-full min-h-[6.75rem] min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-200',
          'hover:shadow-md hover:ring-slate-300/70 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-700/60 dark:hover:ring-slate-600/50',
        ].join(' ')}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          {icon && (
            <div
              className={`flex size-10 items-center justify-center rounded-lg p-2 shadow-sm ${colors.iconBg} ${colors.iconText}`}
            >
              <span className="flex [&_svg]:size-5">{icon}</span>
            </div>
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 px-1.5 pb-2.5 pt-1 text-center">
          <p className="line-clamp-2 text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className={`text-lg font-bold tabular-nums leading-none tracking-tight sm:text-xl ${colors.valueText}`}>
            {value}
          </p>
          {subtitle && (
            <p className="line-clamp-2 text-[10px] leading-snug text-slate-400 dark:text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        'bg-white dark:bg-slate-900 border shadow-sm hover:shadow-md transition-all duration-200 flex items-start min-w-0',
        compact
          ? `rounded-lg p-3 gap-2 ${colors.card}`
          : `rounded-lg p-5 gap-4 ${colors.card}`,
      ].join(' ')}
    >
      {icon && (
        <div
          className={[
            colors.iconBg,
            'shrink-0',
            compact ? 'rounded-lg p-1.5 [&_svg]:size-4' : 'rounded-lg p-2.5',
          ].join(' ')}
        >
          <span className={`${colors.iconText} block`}>{icon}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={
            compact
              ? 'text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate leading-tight'
              : 'text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate'
          }
        >
          {title}
        </p>
        <p
          className={`font-bold tracking-tight tabular-nums ${compact ? 'text-lg mt-0.5 leading-tight' : 'text-2xl mt-1'} ${colors.valueText}`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
