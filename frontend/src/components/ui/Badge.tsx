import type { ReactNode } from 'react';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  // Estados de citas
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'attended'
  | 'cancelled'
  | 'no_show';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, { badge: string; dot: string }> = {
  default: {
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  success: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-400/20',
    dot: 'bg-emerald-500',
  },
  warning: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-inset ring-amber-600/10 dark:ring-amber-400/20',
    dot: 'bg-amber-500',
  },
  danger: {
    badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-inset ring-red-600/10 dark:ring-red-400/20',
    dot: 'bg-red-500',
  },
  info: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10 dark:ring-blue-400/20',
    dot: 'bg-blue-500',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-inset ring-purple-600/10 dark:ring-purple-400/20',
    dot: 'bg-purple-500',
  },
  // Estados de citas
  scheduled: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10 dark:ring-blue-400/20',
    dot: 'bg-blue-500',
  },
  confirmed: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-400/20',
    dot: 'bg-emerald-500',
  },
  in_progress: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-inset ring-amber-600/10 dark:ring-amber-400/20',
    dot: 'bg-amber-500',
  },
  attended: {
    badge: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 ring-1 ring-inset ring-teal-600/10 dark:ring-teal-400/20',
    dot: 'bg-teal-500',
  },
  cancelled: {
    badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-inset ring-red-600/10 dark:ring-red-400/20',
    dot: 'bg-red-500',
  },
  no_show: {
    badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) => {
  const colors = variantClasses[variant];

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-medium leading-none',
        colors.badge,
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
