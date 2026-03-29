import type { ReactNode } from 'react';

export type CardVariant = 'default' | 'flat' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm',
  flat:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800',
  elevated:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const Card = ({
  children,
  title,
  actions,
  footer,
  variant = 'default',
  padding = 'md',
  className = '',
}: CardProps) => {
  return (
    <div
      className={[
        'rounded-2xl overflow-hidden transition-shadow duration-200',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800/80">
          {title && (
            <h3 className="text-base font-semibold text-slate-800 dark:text-white tracking-tight">
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center gap-2 ml-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={paddingClasses[padding]}>{children}</div>

      {footer && (
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
