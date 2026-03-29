import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  action?: ReactNode;
}

const ChevronRightIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  action,
}: PageHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Migas de pan" className="mb-3">
          <ol className="flex items-center flex-wrap gap-1">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <li key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <span className="text-slate-300 dark:text-slate-600">
                      <ChevronRightIcon />
                    </span>
                  )}
                  {item.to && !isLast ? (
                    <Link
                      to={item.to}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`text-xs ${
                        isLast
                          ? 'text-slate-700 dark:text-slate-300 font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Titulo + accion */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accion: en desktop a la derecha, en mobile debajo */}
        {action && (
          <div className="hidden sm:flex items-center shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Accion mobile (debajo del titulo) */}
      {action && (
        <div className="sm:hidden mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
