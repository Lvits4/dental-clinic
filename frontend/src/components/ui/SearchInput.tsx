import { useState, useEffect, useRef } from 'react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  fullWidth?: boolean;
  className?: string;
  /** Para asociar un `<label htmlFor={id}>`. */
  id?: string;
  /** @deprecated Sin efecto: siempre `rounded-md`. */
  rounding?: 'default' | 'compact';
}

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  debounceMs = 400,
  fullWidth = false,
  className = '',
  id,
  rounding = 'default',
}: SearchInputProps) => {
  void rounding;
  const r = 'rounded-md';
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (raw: string) => {
    setLocalValue(raw);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(raw);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={['relative', fullWidth ? 'w-full' : 'w-full sm:max-w-xs', className].filter(Boolean).join(' ')}>
      {/* Lupa */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        id={id}
        type="text"
        role="searchbox"
        autoComplete="off"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full h-10 box-border pl-10 pr-9 py-0 text-sm border transition-all duration-200',
          r,
          'bg-white dark:bg-slate-800/50',
          'text-slate-900 dark:text-white',
          'border-slate-200 dark:border-slate-700',
          'placeholder-slate-400 dark:placeholder-slate-500',
          'hover:border-slate-300 dark:hover:border-slate-600',
          'focus:outline-none focus:ring-1 focus:ring-inset focus:ring-emerald-600/14 dark:focus:ring-emerald-400/12 focus:border-emerald-600/45 dark:focus:border-emerald-500/40',
        ].join(' ')}
      />

      {/* Boton limpiar */}
      {localValue && (
        <button
          onClick={handleClear}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 ${r} text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
          aria-label="Limpiar búsqueda"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
