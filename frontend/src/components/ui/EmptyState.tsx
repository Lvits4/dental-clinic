import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const DefaultIcon = () => (
  <svg
    className="w-14 h-14 text-gray-300 dark:text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

const EmptyState = ({
  icon,
  title = 'Sin resultados',
  description = 'No se encontraron datos para mostrar.',
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center py-14 px-6 text-center',
        className,
      ].join(' ')}
    >
      <div className="mb-4">{icon ?? <DefaultIcon />}</div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
