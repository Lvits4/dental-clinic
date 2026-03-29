import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  /** Si existe y se pasa onSort, la cabecera muestra flechas y es clicable */
  sortKey?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptySlot?: ReactNode;
  loading?: boolean;
  skeletonRows?: number;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (sortKey: string) => void;
  /** Tabla con altura flexible: el padre debe ser flex con flex-1 min-h-0 */
  fillHeight?: boolean;
  /**
   * `sentence`: cabeceras tipo cuadrícula (texto en oración, iconos ↑ activo / ↕ inactivo).
   * `default`: estilo compacto en mayúsculas con doble cheurón.
   */
  headerVariant?: 'default' | 'sentence';
  /** Pie de la tarjeta de escritorio (p. ej. paginación), dentro del mismo borde redondeado */
  footer?: ReactNode;
}

const SortChevrons = ({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc';
}) => (
  <span
    className="inline-flex flex-col shrink-0 justify-center gap-0 text-slate-400 dark:text-slate-500"
    aria-hidden
  >
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 -mb-px ${active && direction === 'asc' ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-40'}`}
      fill="currentColor"
    >
      <path d="M6 2.5L10.5 9h-9L6 2.5z" />
    </svg>
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 ${active && direction === 'desc' ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-40'}`}
      fill="currentColor"
    >
      <path d="M6 9.5L1.5 3h9L6 9.5z" />
    </svg>
  </span>
);

/** Iconos alineados con referencia tipo “data grid”: columna activa ↑/↓; resto ↕ */
const SortSentenceIcons = ({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc';
}) => {
  const muted = 'text-slate-400 dark:text-slate-500';
  const accent = 'text-emerald-600 dark:text-emerald-400';

  if (active && direction === 'asc') {
    return (
      <svg
        viewBox="0 0 12 12"
        className={`h-3 w-3 shrink-0 ${accent}`}
        fill="currentColor"
        aria-hidden
      >
        <path d="M6 2.25L10.75 9h-9.5L6 2.25z" />
      </svg>
    );
  }
  if (active && direction === 'desc') {
    return (
      <svg
        viewBox="0 0 12 12"
        className={`h-3 w-3 shrink-0 ${accent}`}
        fill="currentColor"
        aria-hidden
      >
        <path d="M6 9.75L1.25 3h9.5L6 9.75z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 shrink-0 ${muted}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 1.75L9.25 6.25H2.75L6 1.75z" opacity={0.65} />
      <path d="M6 10.25L2.75 5.75h6.5L6 10.25z" opacity={0.65} />
    </svg>
  );
};

const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-3.5">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
    <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
    <div className="h-3 w-3/4 bg-slate-50 dark:bg-slate-800/60 rounded-md animate-pulse" />
    <div className="h-3 w-2/3 bg-slate-50 dark:bg-slate-800/60 rounded-md animate-pulse" />
  </div>
);

const Table = <T,>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  emptySlot,
  loading = false,
  skeletonRows = 5,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  fillHeight = false,
  headerVariant = 'default',
  footer,
}: TableProps<T>) => {
  const visibleColumns = columns.filter((c) => !c.hideOnMobile);
  const sentenceHeaders = headerVariant === 'sentence';

  const desktopOuter = fillHeight
    ? 'hidden md:flex md:flex-col md:flex-1 md:min-h-0 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden'
    : 'hidden md:block overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm';

  const desktopScroll = fillHeight ? 'flex-1 min-h-0 overflow-auto min-w-0' : 'overflow-x-auto';

  const isRightAligned = (col: Column<T>) => col.className?.includes('text-right') ?? false;

  const thBase = (col: Column<T>) =>
    [
      sentenceHeaders
        ? 'px-5 py-3.5 min-h-[44px] text-sm font-medium text-slate-400 dark:text-slate-500 align-middle'
        : 'px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider align-middle',
      'sticky top-0 z-[1] bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/80',
      isRightAligned(col) ? 'text-right' : 'text-left',
      col.className ?? '',
    ].join(' ');

  const renderHeaderCell = (col: Column<T>) => {
    const right = isRightAligned(col);

    if (col.sortKey && onSort) {
      const active = sortColumn === col.sortKey;
      const ariaSort = active
        ? sortDirection === 'asc'
          ? 'ascending'
          : 'descending'
        : 'none';

      return (
        <th key={col.key} className={thBase(col)}>
          <button
            type="button"
            className={[
              'group flex w-full items-center rounded-lg -mx-1 px-1 transition-colors',
              sentenceHeaders ? 'gap-1.5 py-0.5' : 'gap-2 py-1.5',
              right ? 'justify-end' : 'justify-start',
              'hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-0',
            ].join(' ')}
            aria-sort={ariaSort}
            onClick={(e) => {
              e.stopPropagation();
              onSort(col.sortKey!);
            }}
          >
            {!right && (
              <>
                <span className="whitespace-nowrap">{col.header}</span>
                {sentenceHeaders ? (
                  <SortSentenceIcons active={active} direction={sortDirection} />
                ) : (
                  <SortChevrons active={active} direction={sortDirection} />
                )}
              </>
            )}
            {right && (
              <>
                {sentenceHeaders ? (
                  <SortSentenceIcons active={active} direction={sortDirection} />
                ) : (
                  <SortChevrons active={active} direction={sortDirection} />
                )}
                <span className="whitespace-nowrap">{col.header}</span>
              </>
            )}
          </button>
        </th>
      );
    }

    return (
      <th key={col.key} className={thBase(col)}>
        <div className={`flex w-full items-center min-h-[2.25rem] ${right ? 'justify-end' : 'justify-start'}`}>
          <span>{col.header}</span>
        </div>
      </th>
    );
  };

  const renderSkeletonTh = (col: Column<T>) => (
    <th
      key={col.key}
      className={
        sentenceHeaders
          ? `px-5 py-3.5 min-h-[44px] text-sm font-medium text-slate-400 dark:text-slate-500 ${isRightAligned(col) ? 'text-right' : 'text-left'} sticky top-0 z-[1] bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/80 ${col.className ?? ''}`
          : `px-5 py-3.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${isRightAligned(col) ? 'text-right' : 'text-left'} ${col.className ?? ''}`
      }
    >
      {col.header}
    </th>
  );

  const desktopFooter =
    footer != null ? (
      <div className="shrink-0 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-3 sm:px-4">
        {footer}
      </div>
    ) : null;

  if (loading) {
    return (
      <>
        <div className={desktopOuter}>
          <div className={desktopScroll}>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>{columns.map((col) => renderSkeletonTh(col))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {Array.from({ length: skeletonRows }).map((_, i) => (
                  <SkeletonRow key={i} cols={columns.length} />
                ))}
              </tbody>
            </table>
          </div>
          {desktopFooter}
        </div>

        <div className={fillHeight ? 'md:hidden flex-1 min-h-0 overflow-y-auto space-y-3' : 'md:hidden space-y-3'}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  const isEmpty = data.length === 0;

  return (
    <>
      <div className={desktopOuter}>
        <div className={desktopScroll}>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                {columns.map((col) => renderHeaderCell(col))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {isEmpty ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-14 text-center">
                    {emptySlot ?? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                    )}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick?.(item)}
                    className={[
                      'transition-colors duration-150',
                      onRowClick
                        ? 'cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                        : '',
                      idx % 2 === 1 ? 'bg-slate-25 dark:bg-slate-800/20' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={[
                          'px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 align-middle',
                          isRightAligned(col) ? 'text-right' : 'text-left',
                          col.className ?? '',
                        ].join(' ')}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {desktopFooter}
      </div>

      <div className={fillHeight ? 'md:hidden flex-1 min-h-0 overflow-y-auto space-y-3' : 'md:hidden space-y-3'}>
        {isEmpty ? (
          <div className="py-14 text-center">
            {emptySlot ?? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
            )}
          </div>
        ) : (
          data.map((item) => (
            <div
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={[
                'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5 shadow-sm transition-all duration-200',
                onRowClick
                  ? 'cursor-pointer active:scale-[0.98] active:shadow-none'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {visibleColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start gap-3">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 min-w-[80px] uppercase tracking-wider">
                    {col.mobileLabel ?? col.header}
                  </span>
                  <span className="text-sm text-slate-800 dark:text-white text-right font-medium min-w-0">
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Table;
export type { TableProps };
