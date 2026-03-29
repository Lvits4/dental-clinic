import { useState, useRef, useEffect, type ChangeEvent } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectRadius = 'xl' | '2xl';

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  /** Por defecto `xl`; usar `2xl` para alinear con tablas `rounded-2xl` */
  radius?: SelectRadius;
}

const Select = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  value = '',
  onChange,
  disabled = false,
  required = false,
  id,
  name,
  className = '',
  radius = 'xl',
}: SelectProps) => {
  const radiusClass = radius === '2xl' ? 'rounded-2xl' : 'rounded-xl';
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  // Encontrar la opcion seleccionada
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? 'Seleccionar...';
  const isPlaceholder = !selectedOption;

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

  const handleSelect = (optionValue: string) => {
    setOpen(false);
    if (onChange) {
      // Simular un ChangeEvent<HTMLSelectElement> para mantener compatibilidad
      const syntheticEvent = {
        target: { value: optionValue, name: name ?? '' },
        currentTarget: { value: optionValue, name: name ?? '' },
      } as ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
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
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={[
            'w-full border text-sm transition-all duration-200 text-left',
            radiusClass,
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

          {/* Chevron */}
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {/* Dropdown panel */}
        {open && (
          <ul
            role="listbox"
            className={[
              'absolute z-50 mt-1.5 w-full max-h-60 overflow-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none py-1 focus:outline-none',
              radiusClass,
            ].join(' ')}
          >
            {placeholder && (
              <li
                role="option"
                aria-selected={isPlaceholder}
                onClick={() => handleSelect('')}
                className={[
                  'px-3.5 py-2.5 text-sm cursor-pointer transition-colors duration-150',
                  isPlaceholder
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                ].join(' ')}
              >
                {placeholder}
              </li>
            )}
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={[
                    'px-3.5 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between',
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  ].join(' ')}
                >
                  <span className="truncate">{opt.label}</span>
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

export default Select;
