import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function countDecimals(step: number): number {
  if (!Number.isFinite(step) || Math.floor(step) === step) return 0;
  const s = step.toString();
  if (s.includes('e-')) {
    const [, exp] = s.split('e-');
    return parseInt(exp ?? '0', 10) || 0;
  }
  const parts = s.split('.');
  return parts[1]?.length ?? 0;
}

function clamp(n: number, min?: number, max?: number): number {
  let x = n;
  if (min !== undefined && x < min) x = min;
  if (max !== undefined && x > max) x = max;
  return x;
}

const IconPlus = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconMinus = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  className = '',
  type,
  disabled,
  min,
  max,
  step,
  value,
  onChange,
  ...rest
}: InputProps) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const isNumberStepper = type === 'number' && !rightIcon;

  const borderRingClasses = error
    ? 'border-red-300 dark:border-red-500 focus-within:ring-red-500/18 focus-within:border-red-500/80'
    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus-within:ring-emerald-600/14 dark:focus-within:ring-emerald-400/12 focus-within:border-emerald-600/45 dark:focus-within:border-emerald-500/40';

  const stepperBtnClass = [
    'flex flex-1 min-h-0 items-center justify-center text-slate-500 dark:text-slate-400',
    'transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200',
    'disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-transparent',
  ].join(' ');

  const applyStep = (delta: 1 | -1) => {
    if (!onChange || disabled) return;
    const stepNum = parseFloat(String(step ?? '1'));
    const s = Number.isFinite(stepNum) && stepNum > 0 ? stepNum : 1;
    const decimals = countDecimals(s);
    const minN = min !== undefined && min !== '' ? Number(min) : undefined;
    const maxN = max !== undefined && max !== '' ? Number(max) : undefined;

    const raw = value === undefined || value === '' ? null : Number(value);
    const base =
      raw !== null && Number.isFinite(raw)
        ? raw
        : minN !== undefined && Number.isFinite(minN)
          ? minN
          : 0;

    let next = base + delta * s;
    next = clamp(next, minN, maxN);
    if (decimals > 0) next = Number(next.toFixed(decimals));

    const synthetic = {
      target: { value: String(next), name: rest.name ?? '' },
      currentTarget: { value: String(next), name: rest.name ?? '' },
    } as ChangeEvent<HTMLInputElement>;
    onChange(synthetic);
  };

  const hideNumberSpinners =
    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] [&::-webkit-appearance:textfield]';

  const standardInputClasses = [
    'w-full rounded-md border text-sm transition-all duration-200',
    'bg-white dark:bg-slate-800/50',
    'text-slate-900 dark:text-white',
    'placeholder-slate-400 dark:placeholder-slate-500',
    'focus:outline-none focus:ring-1 focus:ring-inset focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800',
    leftIcon ? 'pl-10' : 'pl-3.5',
    rightIcon ? 'pr-10' : 'pr-3.5',
    'py-2.5',
    error
      ? 'border-red-300 dark:border-red-500 focus:ring-red-500/18 focus:border-red-500/80'
      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-emerald-600/14 dark:focus:ring-emerald-400/12 focus:border-emerald-600/45 dark:focus:border-emerald-500/40',
    type === 'number' ? hideNumberSpinners : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const innerNumberInputClasses = [
    'min-w-0 flex-1 border-0 bg-transparent py-2.5 text-sm text-slate-900 dark:text-white',
    'placeholder-slate-400 dark:placeholder-slate-500',
    'focus:outline-none focus:ring-0',
    'disabled:cursor-not-allowed disabled:bg-transparent',
    leftIcon ? 'pl-10' : 'pl-3.5',
    'pr-2',
    hideNumberSpinners,
  ]
    .filter(Boolean)
    .join(' ');

  const fieldShell = isNumberStepper ? (
    <div
      className={[
        'relative flex min-h-[42px] w-full overflow-hidden rounded-md border text-sm transition-all duration-200',
        'bg-white dark:bg-slate-800/50',
        'focus-within:outline-none focus-within:ring-1 focus-within:ring-inset focus-within:ring-offset-0',
        borderRingClasses,
        disabled ? 'pointer-events-none opacity-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          {leftIcon}
        </span>
      )}
      <input
        id={inputId}
        type="number"
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={innerNumberInputClasses}
        {...rest}
      />
      <div
        className="flex w-9 shrink-0 flex-col border-l border-slate-200 dark:border-slate-700"
        role="group"
        aria-label="Ajustar valor"
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className={`${stepperBtnClass} border-b border-slate-200 dark:border-slate-700`}
          onClick={() => applyStep(1)}
          aria-label="Aumentar valor"
        >
          <IconPlus />
        </button>
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className={stepperBtnClass}
          onClick={() => applyStep(-1)}
          aria-label="Disminuir valor"
        >
          <IconMinus />
        </button>
      </div>
    </div>
  ) : (
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={standardInputClasses}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400 dark:text-slate-500">
          {rightIcon}
        </span>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {rest.required && (
            <span className="ml-1 text-red-500 dark:text-red-400" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {fieldShell}

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

export default Input;
