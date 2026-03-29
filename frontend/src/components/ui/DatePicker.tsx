import { useState, useRef, useEffect, type ChangeEvent } from 'react';

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
const MONTHS_ES = [
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
  const pickerId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  // Calendar navigation state
  const parsed = parseDate(value);
  const today = new Date();
  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());

  // Sync view when value changes externally
  useEffect(() => {
    const p = parseDate(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

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
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
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
          type="button"
          id={pickerId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={[
            'w-full rounded-xl border text-sm transition-all duration-200 text-left',
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

        {/* Calendar Panel */}
        {open && (
          <div className="absolute z-50 mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none p-3">
            {/* Header — Month/Year Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={goToToday}
                className="text-sm font-semibold text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {MONTHS_ES[viewMonth]} {viewYear}
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
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
          </div>
        )}
      </div>

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
