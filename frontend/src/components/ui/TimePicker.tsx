import { useState, useRef, useEffect, type ChangeEvent } from 'react';

export interface TimePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 7; hour <= 20; hour++) {
    const maxMinute = hour === 20 ? 45 : 59;
    for (let minute = 0; minute <= maxMinute; minute += 15) {
      slots.push(`${pad(hour)}:${pad(minute)}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const TimePicker = ({
  label,
  error,
  helperText,
  placeholder = 'Seleccionar hora...',
  value = '',
  onChange,
  disabled = false,
  id,
  className = '',
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pickerId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const isPlaceholder = !value;
  const displayLabel = value || placeholder;

  // Cerrar al hacer clic fuera
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

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Hacer scroll hasta la opción seleccionada cuando se abre
  useEffect(() => {
    if (!open || !value || !listRef.current) return;
    const selectedIndex = TIME_SLOTS.indexOf(value);
    if (selectedIndex === -1) return;
    const listEl = listRef.current;
    const itemHeight = listEl.scrollHeight / TIME_SLOTS.length;
    listEl.scrollTop = Math.max(0, selectedIndex * itemHeight - itemHeight * 2);
  }, [open, value]);

  const handleSelect = (slot: string) => {
    setOpen(false);
    if (onChange) {
      const syntheticEvent = {
        target: { value: slot, name: '' },
        currentTarget: { value: slot, name: '' },
      } as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={pickerId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
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
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="block truncate">{displayLabel}</span>

          {/* Ícono de reloj */}
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </button>

        {/* Dropdown panel */}
        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1.5 w-full max-h-[280px] overflow-y-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none py-1 focus:outline-none"
          >
            {TIME_SLOTS.map((slot) => {
              const isSelected = slot === value;
              return (
                <li
                  key={slot}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(slot)}
                  className={[
                    'px-3.5 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between',
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60',
                  ].join(' ')}
                >
                  <span>{slot}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
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

export default TimePicker;
