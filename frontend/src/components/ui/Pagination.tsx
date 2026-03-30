export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  /** Dentro del pie de tabla: sin padding superior extra */
  embedded?: boolean;
  /** @deprecated Sin efecto: botones siempre `rounded-md`. */
  compact?: boolean;
}

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/** 1 … 4 5 6 … 10 según posición (estilo barra de paginación clásica). */
function getVisiblePages(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }
  if (page >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  embedded = false,
  compact = false,
}: PaginationProps) => {
  void compact;
  if (total < 1) return null;

  const r = 'rounded-md';
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  /** Siempre mostrar barra (Anterior / páginas / Siguiente); con una sola página los botones quedan deshabilitados */
  const safeTotalPages = Math.max(1, totalPages);

  const navBtnClass = [
    'inline-flex items-center justify-center gap-2 min-h-[40px] px-3.5 py-2 text-sm font-medium',
    r,
    'border border-slate-200 dark:border-slate-600',
    'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/40',
    'hover:bg-slate-50 dark:hover:bg-slate-800/80',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-slate-800/40',
    'transition-colors',
  ].join(' ');

  const pageItems = getVisiblePages(page, safeTotalPages);

  return (
    <div
      className={[
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
        embedded ? 'py-3' : 'pt-4',
      ].join(' ')}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left order-2 sm:order-1">
        <span className="hidden sm:inline">Mostrando </span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{from}–{to}</span>
        <span className="hidden sm:inline"> de </span>
        <span className="sm:hidden"> / </span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{total}</span>
        <span className="hidden sm:inline"> resultados</span>
      </p>

      <div
        className={[
          'flex items-center justify-center sm:justify-end gap-4 sm:gap-8 order-1 sm:order-2 flex-wrap',
          'w-full sm:w-auto',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={navBtnClass}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon />
          <span>Anterior</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-0">
          {pageItems.map((item, idx) =>
            item === 'ellipsis' ? (
              <span
                key={`e-${idx}`}
                className="px-1 text-sm font-medium text-slate-400 dark:text-slate-500 select-none"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                type="button"
                key={item}
                onClick={() => onPageChange(item)}
                disabled={safeTotalPages <= 1}
                className={[
                  `min-w-9 h-9 px-2 text-sm font-medium transition-colors ${r}`,
                  'disabled:opacity-50 disabled:cursor-default disabled:hover:text-inherit',
                  page === item
                    ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
                ].join(' ')}
                aria-current={page === item ? 'page' : undefined}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
          className={navBtnClass}
          aria-label="Página siguiente"
        >
          <span>Siguiente</span>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
