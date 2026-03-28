import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  mobileLabel?: string; // etiqueta alternativa en vista card mobile
  hideOnMobile?: boolean; // ocultar esta columna en mobile
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
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
    <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
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
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.className ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
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
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 bg-white dark:bg-gray-900 ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center">
                  {emptySlot ?? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={[
                    'transition-colors',
                    onRowClick
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${col.className ?? ''}`}
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
          <div className="py-10 text-center">
            {emptySlot ?? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            )}
          </div>
        ) : (
          data.map((item) => (
            <div
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={[
                'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-2',
                onRowClick
                  ? 'cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/60'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {visibleColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0 min-w-[80px]">
                    {col.mobileLabel ?? col.header}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white text-right">
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
