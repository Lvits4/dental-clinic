import { useState, useRef, useEffect, useMemo, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from '@floating-ui/react-dom';

/** Por encima del modal (z-50) y del calendario del DatePicker; capa global en body. */
const SELECT_LIST_Z = 1100;
/** ~max-h-60 (15rem). */
const LIST_MAX_H_PX = 240;

export interface SelectOption {
  value: string;
  label: string;
}

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
}: SelectProps) => {
  const radiusClass = 'rounded-md';
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalListRef = useRef<HTMLUListElement | null>(null);

  const middleware = useMemo(
    () => [
      offset(6),
      flip({ fallbackPlacements: ['bottom-start'] }),
      shift({ padding: 8 }),
      size({
        apply({ availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(LIST_MAX_H_PX, Math.max(0, availableHeight))}px`,
          });
        },
      }),
    ],
    [],
  );

  const { refs, floatingStyles, isPositioned } = useFloating({
    open,
    placement: 'top-start',
    strategy: 'fixed',
    middleware,
    whileElementsMounted: autoUpdate,
    transform: false,
  });

  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? 'Seleccionar...';
  const isPlaceholder = !selectedOption;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (portalListRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

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
      const syntheticEvent = {
        target: { value: optionValue, name: name ?? '' },
        currentTarget: { value: optionValue, name: name ?? '' },
      } as ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  const setListRef = (node: HTMLUListElement | null) => {
    portalListRef.current = node;
    refs.setFloating(node);
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
        <button
          ref={refs.setReference}
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={[
            'relative w-full border text-sm transition-all duration-200 text-left',
            radiusClass,
            'bg-white dark:bg-slate-800/50',
            'px-3.5 py-2.5 pr-10',
            'focus:outline-none focus:ring-1 focus:ring-inset focus:ring-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800',
            isPlaceholder
              ? 'text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-white',
            error
              ? 'border-red-300 dark:border-red-500 focus:ring-red-500/18 focus:border-red-500/80'
              : open
                ? 'border-emerald-600/55 dark:border-emerald-500/50 ring-1 ring-inset ring-emerald-600/16 dark:ring-emerald-400/14'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-emerald-600/14 dark:focus:ring-emerald-400/12 focus:border-emerald-600/45 dark:focus:border-emerald-500/40',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="block truncate">{displayLabel}</span>

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
      </div>

      {open &&
        createPortal(
          <ul
            ref={setListRef}
            role="listbox"
            style={{
              ...floatingStyles,
              zIndex: SELECT_LIST_Z,
              visibility: isPositioned ? 'visible' : 'hidden',
            }}
            className={[
              'overflow-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none py-1 focus:outline-none',
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
          </ul>,
          document.body,
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

export default Select;
