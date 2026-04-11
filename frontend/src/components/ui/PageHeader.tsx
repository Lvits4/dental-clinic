import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  action?: ReactNode;
  /** Margen inferior menor (vistas con altura fija, p. ej. dashboard) */
  dense?: boolean;
  /** Solo migas de pan; sin bloque de titulo, subtitulo ni accion */
  hideTitle?: boolean;
  /** Titulo mas discreto (menor tamano y peso) */
  titleTone?: 'default' | 'subtle';
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
  dense = false,
  hideTitle = false,
  titleTone = 'default',
}: PageHeaderProps) => {
  const rootMb = hideTitle ? 'mb-0' : dense ? 'mb-0' : 'mb-6 sm:mb-8';
  const navMb = hideTitle ? 'mb-1.5' : dense ? 'mb-1' : 'mb-3';
  const showTitleBlock = !hideTitle && (title != null || subtitle || action);

  return (
    <div className={`${rootMb} animate-view-enter`}>
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Migas de pan" className={navMb}>
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
                      viewTransition
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

      {showTitleBlock && (
        <>
          {/* Titulo + accion */}
          <div
            className={[
              'flex justify-between gap-4',
              dense && action ? 'items-center' : 'items-start',
            ].join(' ')}
          >
            <div className="min-w-0">
              {title != null && title !== '' && (
                <h1
                  className={
                    titleTone === 'subtle'
                      ? 'text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300 leading-snug truncate'
                      : 'text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-tight tracking-tight truncate'
                  }
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  className={`text-sm text-slate-500 dark:text-slate-400 ${
                    dense ? 'mt-1' : 'mt-1.5'
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {action && (
              <div className="hidden sm:flex items-center shrink-0">
                {action}
              </div>
            )}
          </div>

          {action && (
            <div className="sm:hidden mt-4">
              {action}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PageHeader;
