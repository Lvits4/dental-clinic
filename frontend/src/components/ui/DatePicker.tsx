import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useId,
  useCallback,
  type ChangeEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useOverlayAnchor } from './useOverlayAnchor';

export interface DatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  min?: string;
  max?: string;
}

const DAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
/** Etiquetas cortas en el botón del mes. */
const MONTHS_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

/** Nombres completos en la lista del menú. */
const MONTHS_LONG_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to Monday-based (0=Mon, 6=Sun)
  return day === 0 ? 6 : day - 1;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return { year: y, month: m - 1, day: d };
}

/** Años permitidos según `min` / `max` (YYYY-MM-DD); por defecto ~100 años atrás y 10 adelante. */
function getYearRange(min?: string, max?: string): { minY: number; maxY: number } {
  const cy = new Date().getFullYear();
  let minY = cy - 100;
  let maxY = cy + 10;
  if (min) {
    const y = Number(min.slice(0, 4));
    if (!Number.isNaN(y)) minY = y;
  }
  if (max) {
    const y = Number(max.slice(0, 4));
    if (!Number.isNaN(y)) maxY = y;
  }
  if (minY > maxY) return { minY: maxY, maxY: minY };
  return { minY, maxY };
}

const calendarMenuListClass =
  'max-h-44 overflow-y-auto overscroll-contain rounded-lg border border-slate-200/90 dark:border-slate-600 bg-white dark:bg-slate-800 py-1 shadow-xl shadow-slate-900/12 dark:shadow-black/40 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent]';

const calendarMenuItemClass =
  'w-full px-3 py-2 text-left text-sm transition-colors duration-150 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60';

const calendarMenuItemSelectedClass =
  'bg-emerald-50 dark:bg-emerald-900/35 text-emerald-800 dark:text-emerald-300 font-medium';

const calendarTriggerBaseClass =
  'flex min-w-0 w-full items-center justify-between gap-1.5 rounded-lg border text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/35 focus:ring-offset-0 focus:border-emerald-500 dark:focus:border-emerald-400';

const DatePicker = ({
  label,
  error,
  helperText,
  placeholder = 'Seleccionar fecha...',
  value = '',
  onChange,
  disabled = false,
  required = false,
  id,
  name,
  className = '',
  min,
  max,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalPanelRef = useRef<HTMLDivElement>(null);
  const anchorRect = useOverlayAnchor(buttonRef, open, 6, { estimatedHeightPx: 400 });
  const pickerId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const panelWidthPx = 320; // w-80

  const { minY, maxY } = useMemo(() => getYearRange(min, max), [min, max]);

  const calendarLeft = useMemo(() => {
    if (!anchorRect) return 0;
    const vw = typeof globalThis !== 'undefined' ? globalThis.innerWidth : 1024;
    return Math.max(8, Math.min(anchorRect.left, vw - panelWidthPx - 8));
  }, [anchorRect, panelWidthPx]);

  // Calendar navigation state
  const parsed = parseDate(value);
  const today = new Date();
  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());

  const yearSelectOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = maxY; y >= minY; y--) years.push(y);
    if (!years.includes(viewYear)) {
      years.push(viewYear);
      years.sort((a, b) => b - a);
    }
    return years;
  }, [minY, maxY, viewYear]);

  const fieldId = useId();
  const monthSelectId = `${pickerId ?? fieldId}-month`;
  const yearSelectId = `${pickerId ?? fieldId}-year`;

  const [headerMenu, setHeaderMenu] = useState<'month' | 'year' | null>(null);

  useEffect(() => {
    if (!open) setHeaderMenu(null);
  }, [open]);

  const monthTriggerRef = useRef<HTMLButtonElement>(null);
  const yearTriggerRef = useRef<HTMLButtonElement>(null);
  const monthListRef = useRef<HTMLUListElement>(null);
  const yearListRef = useRef<HTMLUListElement>(null);
  const [menuRect, setMenuRect] = useState({ top: 0, left: 0, width: 0 });

  const updateMenuRect = useCallback(() => {
    if (!headerMenu) return;
    const el = headerMenu === 'month' ? monthTriggerRef.current : yearTriggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width =
      headerMenu === 'year'
        ? Math.max(r.width, 5.5 * 16)
        : Math.max(r.width, 11 * 16);
    const listMax = 176; // ~max-h-44
    let top = r.bottom + 6;
    if (typeof globalThis.window !== 'undefined') {
      if (top + listMax > globalThis.window.innerHeight - 10) {
        top = Math.max(10, r.top - listMax - 6);
      }
      let left = r.left;
      left = Math.min(left, globalThis.window.innerWidth - width - 10);
      left = Math.max(10, left);
      setMenuRect({ top, left, width });
      return;
    }
    setMenuRect({ top, left: r.left, width });
  }, [headerMenu]);

  useLayoutEffect(() => {
    updateMenuRect();
  }, [headerMenu, updateMenuRect, viewMonth, viewYear]);

  useLayoutEffect(() => {
    if (headerMenu !== 'year' || !yearListRef.current) return;
    const selected = yearListRef.current.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [headerMenu, viewYear]);

  useEffect(() => {
    if (!headerMenu) return;
    const onScrollResize = () => updateMenuRect();
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    return () => {
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [headerMenu, updateMenuRect]);

  // Sync view when value changes externally
  useEffect(() => {
    const p = parseDate(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  // Mantener año visible dentro del rango si cambian min/max
  useEffect(() => {
    setViewYear((y) => Math.min(maxY, Math.max(minY, y)));
  }, [minY, maxY]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (portalPanelRef.current?.contains(t)) return;
      if (monthTriggerRef.current?.contains(t)) return;
      if (yearTriggerRef.current?.contains(t)) return;
      if (monthListRef.current?.contains(t)) return;
      if (yearListRef.current?.contains(t)) return;
      setOpen(false);
      setHeaderMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (headerMenu) {
        setHeaderMenu(null);
        return;
      }
      setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, headerMenu]);

  const handleSelect = (day: number) => {
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    setOpen(false);
    if (onChange) {
      const syntheticEvent = {
        target: { value: dateStr, name: name ?? '' },
        currentTarget: { value: dateStr, name: name ?? '' },
      } as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      const syntheticEvent = {
        target: { value: '', name: name ?? '' },
        currentTarget: { value: '', name: name ?? '' },
      } as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const prevMonth = () => {
    setHeaderMenu(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    setHeaderMenu(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

  const isToday = (day: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate();

  const isSelected = (day: number) =>
    parsed !== null &&
    viewYear === parsed.year &&
    viewMonth === parsed.month &&
    day === parsed.day;

  const isDisabledDate = (day: number): boolean => {
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    if (min && dateStr < min) return true;
    if (max && dateStr > max) return true;
    return false;
  };

  const displayLabel = value ? formatDisplayDate(value) : placeholder;
  const isPlaceholder = !value;

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={pickerId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500 dark:text-red-400" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          ref={buttonRef}
          type="button"
          id={pickerId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={[
            'w-full rounded-lg border text-sm transition-all duration-200 text-left',
            'bg-white dark:bg-slate-800/50',
            'px-3.5 py-2.5 pr-10',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800',
            isPlaceholder
              ? 'text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-white',
            error
              ? 'border-red-300 dark:border-red-500 focus:ring-red-500/30 focus:border-red-500'
              : open
                ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-emerald-500/30 focus:border-emerald-500',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="block truncate">{displayLabel}</span>

          {/* Icons */}
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {value && !disabled && (
              <span
                className="pointer-events-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                onClick={handleClear}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
            <span className="text-slate-400 dark:text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </span>
        </button>
      </div>

      {open && anchorRect && (
        <>
          {createPortal(
          <div
            ref={portalPanelRef}
            style={{
              position: 'fixed',
              top: anchorRect.top,
              left: calendarLeft,
              zIndex: 100,
              maxHeight: anchorRect.maxHeight,
              overflowY: anchorRect.maxHeight != null ? 'auto' : undefined,
            }}
            className="w-80 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none p-3"
          >
            {/* Mes y año: grid para que el mes nunca colapse a solo el chevron */}
            <div className="grid grid-cols-[auto_minmax(4.25rem,1fr)_auto_auto] gap-1.5 mb-3 items-center">
              <button
                type="button"
                onClick={prevMonth}
                className="shrink-0 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Mes anterior"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                ref={monthTriggerRef}
                type="button"
                id={monthSelectId}
                aria-label="Mes"
                aria-haspopup="listbox"
                aria-controls={`${monthSelectId}-list`}
                aria-expanded={headerMenu === 'month'}
                onClick={() => {
                  setHeaderMenu((m) => (m === 'month' ? null : 'month'));
                }}
                className={[
                  calendarTriggerBaseClass,
                  'min-w-0 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/90 px-2.5 py-2 text-slate-800 dark:text-slate-100',
                  'hover:border-emerald-300/80 dark:hover:border-emerald-700/60',
                  headerMenu === 'month'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 dark:ring-emerald-400/25'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="min-w-0 flex-1 truncate text-left">
                  {MONTHS_SHORT_ES[viewMonth]}
                </span>
                <svg
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${headerMenu === 'month' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                ref={yearTriggerRef}
                type="button"
                id={yearSelectId}
                aria-label="Año"
                aria-haspopup="listbox"
                aria-controls={`${yearSelectId}-list`}
                aria-expanded={headerMenu === 'year'}
                onClick={() => {
                  setHeaderMenu((m) => (m === 'year' ? null : 'year'));
                }}
                className={[
                  calendarTriggerBaseClass,
                  'w-[4.75rem] min-w-[4.75rem] shrink-0 justify-self-stretch border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/90 px-2 py-2 tabular-nums text-slate-800 dark:text-slate-100',
                  'hover:border-emerald-300/80 dark:hover:border-emerald-700/60',
                  headerMenu === 'year'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 dark:ring-emerald-400/25'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="min-w-0 flex-1 truncate text-center">{viewYear}</span>
                <svg
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${headerMenu === 'year' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="shrink-0 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Mes siguiente"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_ES.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Previous month trailing days */}
              {Array.from({ length: firstDay }, (_, i) => {
                const day = prevMonthDays - firstDay + 1 + i;
                return (
                  <div
                    key={`prev-${i}`}
                    className="w-full aspect-square flex items-center justify-center text-xs text-slate-300 dark:text-slate-600"
                  >
                    {day}
                  </div>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const selected = isSelected(day);
                const todayMark = isToday(day);
                const disabledDay = isDisabledDate(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabledDay}
                    onClick={() => handleSelect(day)}
                    className={[
                      'w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-all duration-150',
                      disabledDay
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : selected
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-sm shadow-emerald-500/30'
                          : todayMark
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold ring-1 ring-emerald-200 dark:ring-emerald-800'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {day}
                  </button>
                );
              })}

              {/* Next month leading days */}
              {(() => {
                const totalCells = firstDay + daysInMonth;
                const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
                return Array.from({ length: remaining }, (_, i) => (
                  <div
                    key={`next-${i}`}
                    className="w-full aspect-square flex items-center justify-center text-xs text-slate-300 dark:text-slate-600"
                  >
                    {i + 1}
                  </div>
                ));
              })()}
            </div>

            {/* Footer */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setViewYear(today.getFullYear());
                  setViewMonth(today.getMonth());
                  handleSelect(today.getDate());
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Hoy
              </button>
              {value && (
                <button
                  type="button"
                  onClick={(e) => { handleClear(e); setOpen(false); }}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>,
          document.body,
          )}
          {headerMenu === 'month' &&
            createPortal(
              <ul
                ref={monthListRef}
                id={`${monthSelectId}-list`}
                role="listbox"
                aria-label="Seleccionar mes"
                style={{
                  position: 'fixed',
                  top: menuRect.top,
                  left: menuRect.left,
                  width: menuRect.width,
                  zIndex: 110,
                }}
                className={calendarMenuListClass}
              >
                {MONTHS_LONG_ES.map((mLabel, monthIndex) => {
                  const selected = viewMonth === monthIndex;
                  return (
                    <li key={mLabel} className="list-none" role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setViewMonth(monthIndex);
                          setHeaderMenu(null);
                        }}
                        className={[calendarMenuItemClass, selected ? calendarMenuItemSelectedClass : '']
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {mLabel}
                      </button>
                    </li>
                  );
                })}
              </ul>,
              document.body,
            )}
          {headerMenu === 'year' &&
            createPortal(
              <ul
                ref={yearListRef}
                id={`${yearSelectId}-list`}
                role="listbox"
                aria-label="Seleccionar año"
                style={{
                  position: 'fixed',
                  top: menuRect.top,
                  left: menuRect.left,
                  width: menuRect.width,
                  zIndex: 110,
                }}
                className={calendarMenuListClass}
              >
                {yearSelectOptions.map((y) => {
                  const selected = viewYear === y;
                  return (
                    <li key={y} className="list-none" role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        data-selected={selected ? 'true' : undefined}
                        onClick={() => {
                          setViewYear(y);
                          setHeaderMenu(null);
                        }}
                        className={[calendarMenuItemClass, selected ? calendarMenuItemSelectedClass : '']
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {y}
                      </button>
                    </li>
                  );
                })}
              </ul>,
              document.body,
            )}
        </>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export default DatePicker;
