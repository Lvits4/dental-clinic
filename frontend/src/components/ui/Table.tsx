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
   * `sentence`: cabeceras tipo cuadrícula (texto en oración; siempre ↑↓ con una resaltada si la columna ordena).
   * `default`: estilo compacto en mayúsculas con doble cheurón.
   */
  headerVariant?: 'default' | 'sentence';
  /** Pie de la tarjeta de escritorio (p. ej. paginación), dentro del mismo borde redondeado */
  footer?: ReactNode;
  /** @deprecated Sin efecto: el marco siempre usa `rounded-md`. */
  surfaceRounding?: 'default' | 'compact';
}

/** Siempre dos cheurones; el activo resalta según dirección (misma altura visual en todas las columnas). */
const SortChevrons = ({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc';
}) => {
  const upOn = active && direction === 'asc';
  const downOn = active && direction === 'desc';
  return (
    <span
      className="inline-flex flex-col shrink-0 justify-center gap-px text-slate-500 dark:text-slate-400"
      aria-hidden
    >
      <svg
        viewBox="0 0 12 12"
        className={`h-2.5 w-2.5 shrink-0 ${upOn ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-40'}`}
        fill="currentColor"
      >
        <path d="M6 2.5L10.5 9h-9L6 2.5z" />
      </svg>
      <svg
        viewBox="0 0 12 12"
        className={`h-2.5 w-2.5 shrink-0 ${downOn ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-40'}`}
        fill="currentColor"
      >
        <path d="M6 9.5L1.5 3h9L6 9.5z" />
      </svg>
    </span>
  );
};

/** Misma lógica que SortChevrons: siempre ↑ y ↓; columna ordenada resalta una de las dos. */
const SortSentenceIcons = ({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc';
}) => {
  const upOn = active && direction === 'asc';
  const downOn = active && direction === 'desc';
  return (
    <span
      className="inline-flex flex-col items-center justify-center gap-px shrink-0 text-slate-500 dark:text-slate-400"
      aria-hidden
    >
      <svg
        viewBox="0 0 12 12"
        className={`h-2.5 w-2.5 shrink-0 ${upOn ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-45'}`}
        fill="currentColor"
      >
        <path d="M6 2.25L10.5 8.25h-9L6 2.25z" />
      </svg>
      <svg
        viewBox="0 0 12 12"
        className={`h-2.5 w-2.5 shrink-0 ${downOn ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-45'}`}
        fill="currentColor"
      >
        <path d="M6 9.75L1.5 3.75h9L6 9.75z" />
      </svg>
    </span>
  );
};

const SkeletonRow = ({ cols, r }: { cols: number; r: string }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-3.5">
        <div className={`h-4 bg-slate-100 dark:bg-slate-800 ${r} animate-pulse`} />
      </td>
    ))}
  </tr>
);

const SkeletonCard = ({ r }: { r: string }) => (
  <div className={`bg-white dark:bg-slate-900 ${r} border border-slate-200/80 dark:border-slate-800 p-5 space-y-3`}>
    <div className={`h-4 w-1/2 bg-slate-100 dark:bg-slate-800 ${r} animate-pulse`} />
    <div className={`h-3 w-3/4 bg-slate-50 dark:bg-slate-800/60 ${r} animate-pulse`} />
    <div className={`h-3 w-2/3 bg-slate-50 dark:bg-slate-800/60 ${r} animate-pulse`} />
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
  surfaceRounding = 'default',
}: TableProps<T>) => {
  void surfaceRounding;
  const visibleColumns = columns.filter((c) => !c.hideOnMobile);
  const sentenceHeaders = headerVariant === 'sentence';
  const r = 'rounded-md';

  const desktopOuter = fillHeight
    ? `hidden md:flex md:flex-col md:flex-1 md:min-h-0 ${r} border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden`
    : `hidden md:block overflow-x-auto bg-white dark:bg-slate-900 ${r} border border-slate-200/80 dark:border-slate-800 shadow-sm`;

  const desktopScroll = fillHeight ? 'flex-1 min-h-0 overflow-auto min-w-0' : 'overflow-x-auto';

  const cellAlign = (col: Column<T>): 'left' | 'right' | 'center' => {
    const cn = col.className ?? '';
    if (cn.includes('text-center')) return 'center';
    if (cn.includes('text-right')) return 'right';
    return 'left';
  };

  const textAlignClass = (a: 'left' | 'right' | 'center') =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

  const flexJustifyClass = (a: 'left' | 'right' | 'center') =>
    a === 'right' ? 'justify-end' : a === 'center' ? 'justify-center' : 'justify-start';

  const thBase = (col: Column<T>) =>
    [
      sentenceHeaders
        ? 'px-5 py-3 min-h-[42px] text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-tight align-middle'
        : 'px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider align-middle',
      /* Fondo opaco sin backdrop-blur: evita costuras oscuras al repintar junto al cuerpo al ordenar. */
      'sticky top-0 z-[1] bg-slate-100 dark:bg-slate-800 border-b border-slate-200/90 dark:border-slate-700/90',
      textAlignClass(cellAlign(col)),
      col.className ?? '',
    ].join(' ');

  const renderHeaderCell = (col: Column<T>) => {
    const align = cellAlign(col);

    if (col.sortKey && onSort) {
      const active = sortColumn === col.sortKey;
      const ariaSort = active
        ? sortDirection === 'asc'
          ? 'ascending'
          : 'descending'
        : 'none';

      return (
        <th
          key={col.key}
          className={[thBase(col), 'outline-none focus-within:outline-none [&_button::-moz-focus-inner]:border-0'].join(' ')}
        >
          <button
            type="button"
            className={[
              `table-sort-header-btn flex w-full items-center ${r} -mx-1 px-1.5`,
              sentenceHeaders ? 'gap-2 py-0.5' : 'gap-2 py-1',
              flexJustifyClass(align),
              'appearance-none bg-transparent border-0 shadow-none ring-0 ring-offset-0',
              'outline-none focus:outline-none focus-visible:outline-none',
              /* Sin ring-inset (en celdas anchas parece una raya horizontal). Fondo suave solo con teclado. */
              'focus-visible:shadow-none focus-visible:bg-slate-200/55 dark:focus-visible:bg-slate-600/35',
              'active:bg-transparent hover:bg-transparent',
              '[-webkit-tap-highlight-color:transparent]',
            ].join(' ')}
            aria-sort={ariaSort}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSort(col.sortKey!);
            }}
          >
            {align !== 'right' && (
              <>
                <span className="whitespace-nowrap text-slate-700 dark:text-slate-200">{col.header}</span>
                {sentenceHeaders ? (
                  <SortSentenceIcons active={active} direction={sortDirection} />
                ) : (
                  <SortChevrons active={active} direction={sortDirection} />
                )}
              </>
            )}
            {align === 'right' && (
              <>
                {sentenceHeaders ? (
                  <SortSentenceIcons active={active} direction={sortDirection} />
                ) : (
                  <SortChevrons active={active} direction={sortDirection} />
                )}
                <span className="whitespace-nowrap text-slate-700 dark:text-slate-200">{col.header}</span>
              </>
            )}
          </button>
        </th>
      );
    }

    return (
      <th key={col.key} className={thBase(col)}>
        <div
          className={`flex w-full items-center min-h-8 ${flexJustifyClass(align)} ${sentenceHeaders ? 'px-0.5' : ''}`}
        >
          <span className={sentenceHeaders ? 'text-slate-700 dark:text-slate-200' : ''}>{col.header}</span>
        </div>
      </th>
    );
  };

  const renderSkeletonTh = (col: Column<T>) => (
    <th
      key={col.key}
      className={
        sentenceHeaders
          ? `px-5 py-3 min-h-[42px] text-sm font-semibold text-slate-600 dark:text-slate-300 ${textAlignClass(cellAlign(col))} sticky top-0 z-1 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/90 dark:border-slate-700/90 ${col.className ?? ''}`
          : `px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${textAlignClass(cellAlign(col))} ${col.className ?? ''}`
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
            <table className="w-full table-auto border-separate border-spacing-0 outline-none">
              <thead>
                <tr>{columns.map((col) => renderSkeletonTh(col))}</tr>
              </thead>
              <tbody className="[&>tr:not(:last-child)>td]:border-b [&>tr:not(:last-child)>td]:border-slate-100 dark:[&>tr:not(:last-child)>td]:border-slate-800/60">
                {Array.from({ length: skeletonRows }).map((_, i) => (
                  <SkeletonRow key={i} cols={columns.length} r={r} />
                ))}
              </tbody>
            </table>
          </div>
          {desktopFooter}
        </div>

        <div className={fillHeight ? 'md:hidden flex-1 min-h-0 overflow-y-auto space-y-3' : 'md:hidden space-y-3'}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} r={r} />
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
          <table className="w-full table-auto border-separate border-spacing-0 outline-none">
            <thead>
              <tr>
                {columns.map((col) => renderHeaderCell(col))}
              </tr>
            </thead>
            <tbody className="[&>tr:not(:last-child)>td]:border-b [&>tr:not(:last-child)>td]:border-slate-100 dark:[&>tr:not(:last-child)>td]:border-slate-800/50">
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
                /* Sin transition-colors: con divide/bordes evita parpadeos al repintar al ordenar. */
                onRowClick
                ? 'cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                : '',
                'animate-[staggerFadeIn_0.25s_ease-out_both]',
                idx % 2 === 1 ? 'bg-slate-25 dark:bg-slate-800/20' : '',
              ]
                .filter(Boolean)
                .join(' ')}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={[
                          'px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 align-middle',
                          textAlignClass(cellAlign(col)),
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
        data.map((item, idx) => (
          <div
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={[
            `bg-white dark:bg-slate-900 ${r} border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5 shadow-sm transition-all duration-200 animate-[staggerFadeIn_0.3s_ease-out_both]`,
            onRowClick
            ? 'cursor-pointer active:scale-[0.98] active:shadow-none'
            : '',
          ]
            .filter(Boolean)
            .join(' ')}
            style={{ animationDelay: `${idx * 50}ms` }}
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
