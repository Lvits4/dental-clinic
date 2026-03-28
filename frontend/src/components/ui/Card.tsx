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
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm',
  flat:
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
  elevated:
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-5 sm:p-8',
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
        'rounded-xl overflow-hidden',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 dark:border-gray-800">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
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
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
