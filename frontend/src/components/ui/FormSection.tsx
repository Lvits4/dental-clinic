import type { ReactNode } from 'react';

export interface FormSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const FormSection = ({
  title,
  description,
  icon,
  children,
  className = '',
}: FormSectionProps) => {
  return (
    <fieldset
      className={[
        'relative rounded-lg border border-slate-100 dark:border-slate-800/60',
        'bg-slate-50/40 dark:bg-slate-800/20',
        'p-4 sm:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <legend className="px-2 -ml-1">
        <span className="inline-flex items-center gap-2">
          {icon && (
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              {icon}
            </span>
          )}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            {title}
          </span>
        </span>
      </legend>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 -mt-1">
          {description}
        </p>
      )}
      <div className="mt-1">{children}</div>
    </fieldset>
  );
};

export default FormSection;
