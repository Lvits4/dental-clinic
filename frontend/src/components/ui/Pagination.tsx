export type PaginationRadius = 'xl' | '2xl';

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  /** Radio de botones; `2xl` alinea con tablas `rounded-2xl` */
  radius?: PaginationRadius;
}

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  radius = 'xl',
}: PaginationProps) => {
  if (total < 1) return null;

  const r = radius === '2xl' ? 'rounded-2xl' : 'rounded-xl';
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const showNav = totalPages > 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 order-2 sm:order-1 text-center sm:text-left">
        <span className="hidden sm:inline">Mostrando </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{from}–{to}</span>
        <span className="hidden sm:inline"> de </span>
        <span className="sm:hidden"> / </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>
        <span className="hidden sm:inline"> resultados</span>
      </p>

      {showNav && (
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-3 py-2 text-sm ${r} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-xs`}
          aria-label="Pagina anterior"
        >
          <ChevronLeftIcon />
          <span className="hidden sm:inline ml-1">Anterior</span>
        </button>

        {/* Paginas numeradas (desktop) */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
            })
            .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                acc.push('ellipsis');
              }
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-2 text-sm text-slate-400 dark:text-slate-600"
                >
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={p}
                  onClick={() => onPageChange(p as number)}
                  className={[
                    'min-w-[36px] h-9 px-2 text-sm transition-all duration-200 font-medium',
                    r,
                    page === p
                      ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-500/25 font-semibold'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800',
                  ].join(' ')}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
        </div>

        {/* Indicador compacto (mobile) */}
        <span className="sm:hidden px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 min-h-[44px] inline-flex items-center">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-3 py-2 text-sm ${r} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-xs`}
          aria-label="Pagina siguiente"
        >
          <span className="hidden sm:inline mr-1">Siguiente</span>
          <ChevronRightIcon />
        </button>
      </div>
      )}
    </div>
  );
};

export default Pagination;
