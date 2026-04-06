import { useEffect, useState } from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  /** Al cambiar el tamaño de página el padre suele reiniciar a página 1 y actualizar `limit` en la petición. */
  onLimitChange?: (limit: number) => void;
  /** Límite inferior del input (por defecto 1). */
  minLimit?: number;
  /** Límite superior del input (p. ej. 100 en la mayoría de APIs; tratamientos permiten 500). */
  maxLimit?: number;
  /** Dentro del pie de tabla: sin padding superior extra */
  embedded?: boolean;
  /** @deprecated Sin efecto; el diseño ya es compacto. */
  compact?: boolean;
}

const ChevronLeftIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/** Sin spinners del navegador + aspecto alineado al tema claro/oscuro. */
const limitInputClass =
  [
    'box-border h-full min-w-[2rem] w-10 max-w-[2.75rem] shrink-0 border-0 bg-transparent',
    'px-1 text-center text-sm font-medium tabular-nums',
    'text-slate-800 dark:text-slate-100',
    'outline-none',
    'appearance-none [-moz-appearance:textfield]',
    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    'placeholder:text-slate-400 dark:placeholder:text-slate-500',
  ].join(' ');

const Pagination = ({
  page,
  totalPages: _totalPagesHint,
  total,
  limit,
  onPageChange,
  onLimitChange,
  minLimit = 1,
  maxLimit = 100,
  embedded = false,
  compact = false,
}: PaginationProps) => {
  void compact;
  void _totalPagesHint;

  const limitNum = Math.max(minLimit, Number(limit) || minLimit);
  const totalNum = Math.max(0, Number(total) || 0);
  if (totalNum < 1) return null;

  const pageRaw = Number(page);
  const pageNum = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  const safeTotalPages = Math.max(1, Math.ceil(totalNum / limitNum));
  const effectivePage = Math.min(pageNum, safeTotalPages);

  const r = 'rounded-md';
  const from = (effectivePage - 1) * limitNum + 1;
  const to = Math.min(effectivePage * limitNum, totalNum);

  const [limitDraft, setLimitDraft] = useState(String(limitNum));
  useEffect(() => {
    setLimitDraft(String(limitNum));
  }, [limitNum]);

  const commitLimit = () => {
    if (!onLimitChange) return;
    const raw = limitDraft.trim();
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 1) {
      setLimitDraft(String(limitNum));
      return;
    }
    const clamped = Math.min(maxLimit, Math.max(minLimit, Math.floor(n)));
    setLimitDraft(String(clamped));
    if (clamped !== limitNum) onLimitChange(clamped);
  };

  const navBtnClass = [
    'box-border inline-flex h-8 shrink-0 items-center justify-center gap-1 px-2.5 text-sm font-medium',
    r,
    'border border-slate-200 dark:border-slate-600',
    'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/50',
    'hover:bg-slate-50 dark:hover:bg-slate-800',
    'transition-colors',
  ].join(' ');

  const canPrev = effectivePage > 1;
  const canNext = effectivePage < safeTotalPages;

  return (
    <div className={embedded ? 'py-2' : 'pt-3 pb-1'}>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (canPrev) onPageChange(effectivePage - 1);
            }}
            className={navBtnClass}
            aria-label="Página anterior"
            aria-disabled={!canPrev}
          >
            <ChevronLeftIcon />
            <span>Anterior</span>
          </button>

          {onLimitChange ? (
            <label className="box-border inline-flex h-8 shrink-0 cursor-text items-center gap-2 rounded-md border border-slate-200/90 dark:border-slate-600 bg-white dark:bg-slate-800/60 px-2 text-xs text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-none">
              <span className="whitespace-nowrap select-none leading-none">Por pág.</span>
              <span className="inline-flex h-6 min-h-6 items-stretch overflow-hidden rounded border border-slate-200/90 dark:border-slate-600/90 bg-slate-100 dark:bg-slate-900/95 focus-within:ring-2 focus-within:ring-emerald-500/45 focus-within:ring-offset-0 dark:focus-within:ring-emerald-400/35">
                <input
                  type="number"
                  inputMode="numeric"
                  min={minLimit}
                  max={maxLimit}
                  value={limitDraft}
                  onChange={(e) => setLimitDraft(e.target.value)}
                  onBlur={commitLimit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className={limitInputClass}
                  aria-label={`Resultados por página (${minLimit}–${maxLimit})`}
                  title={`Entre ${minLimit} y ${maxLimit}`}
                />
              </span>
            </label>
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (canNext) onPageChange(effectivePage + 1);
            }}
            className={navBtnClass}
            aria-label="Página siguiente"
            aria-disabled={!canNext}
          >
            <span>Siguiente</span>
            <ChevronRightIcon />
          </button>
        </div>

        <p
          className="text-xs tabular-nums text-slate-500 dark:text-slate-400"
          aria-live="polite"
          aria-label={`Registros ${from} a ${to} de ${totalNum}. Página ${effectivePage} de ${safeTotalPages}.`}
        >
          {from}–{to} / {totalNum}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
