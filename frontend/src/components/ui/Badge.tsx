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
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  danger:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  info:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  purple:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  // Estados de citas
  scheduled:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  confirmed:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  in_progress:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  attended:
    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
  cancelled:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  no_show:
    'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) => {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium leading-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
};

export default Badge;
