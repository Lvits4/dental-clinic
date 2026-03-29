import type { ReactNode } from 'react';

type StatCardColor = 'emerald' | 'blue' | 'purple' | 'red' | 'yellow' | 'gray';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: StatCardColor;
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

const StatCard = ({ title, value, subtitle, icon, color = 'emerald' }: StatCardProps) => {
  const colors = COLOR_MAP[color];

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border ${colors.card} shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4`}
    >
      {icon && (
        <div className={`${colors.iconBg} rounded-xl p-2.5 shrink-0`}>
          <span className={`${colors.iconText} block`}>{icon}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className={`text-2xl font-bold mt-1 tracking-tight ${colors.valueText}`}>
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
