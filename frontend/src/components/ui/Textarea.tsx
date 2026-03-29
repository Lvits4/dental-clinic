import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = ({
  label,
  error,
  helperText,
  id,
  className = '',
  rows = 4,
  ...props
}: TextareaProps) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-red-500 dark:text-red-400" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={[
          'w-full rounded-lg border text-sm transition-all duration-200 resize-y',
          'bg-white dark:bg-slate-800/50',
          'text-slate-900 dark:text-white',
          'placeholder-slate-400 dark:placeholder-slate-500',
          'px-3.5 py-2.5',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800',
          error
            ? 'border-red-300 dark:border-red-500 focus:ring-red-500/30 focus:border-red-500'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-emerald-500/30 focus:border-emerald-500',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

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

export default Textarea;
