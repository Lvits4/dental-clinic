import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
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
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

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

// ─── Componente principal ─────────────────────────────────────────────────────

const Table = <T,>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  emptySlot,
  loading = false,
  skeletonRows = 5,
}: TableProps<T>) => {
  const visibleColumns = columns.filter((c) => !c.hideOnMobile);

  // ── Loading state ──
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-5 py-3.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${col.className?.includes('text-right') ? 'text-right' : 'text-left'} ${col.className ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  // ── Empty state ──
  const isEmpty = data.length === 0;

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm first:rounded-tl-2xl last:rounded-tr-2xl ${col.className?.includes('text-right') ? 'text-right' : 'text-left'} ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
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
                      className={`px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 ${col.className ?? ''}`}
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

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
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
                  <span className="text-sm text-slate-800 dark:text-white text-right font-medium">
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
