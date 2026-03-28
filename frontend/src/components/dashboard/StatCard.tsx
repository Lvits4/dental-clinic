import type { ReactNode } from 'react';

type StatCardColor = 'emerald' | 'blue' | 'purple' | 'red' | 'yellow' | 'gray';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: StatCardColor;
}

const COLOR_MAP: Record<StatCardColor, { bg: string; text: string; iconBg: string }> = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-800/40',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-800/40',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-800/40',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-800/40',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-800/40',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-700/20',
    text: 'text-gray-600 dark:text-gray-400',
    iconBg: 'bg-gray-100 dark:bg-gray-700/40',
  },
};

const StatCard = ({ title, value, subtitle, icon, color = 'emerald' }: StatCardProps) => {
  const colors = COLOR_MAP[color];

  return (
    <div
      className={`${colors.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-start gap-3`}
    >
      {icon && (
        <div className={`${colors.iconBg} rounded-lg p-2 shrink-0`}>
          <span className={`${colors.text} block`}>{icon}</span>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${colors.text}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
