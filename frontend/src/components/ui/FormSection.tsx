import type { ReactNode } from 'react';

export interface FormSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Clases extra para el párrafo de descripción (p. ej. altura mínima alineada entre columnas) */
  descriptionClassName?: string;
  /** Menos padding y tipografía de apoyo más compacta */
  dense?: boolean;
}

const FormSection = ({
  title,
  description,
  icon,
  children,
  className = '',
  descriptionClassName = '',
  dense = false,
}: FormSectionProps) => {
  const r = 'rounded-md';
  const pad = dense ? 'p-3 sm:p-3.5' : 'p-4 sm:p-5';
  const descMb = dense ? 'mb-2.5' : 'mb-4';
  const descMt = dense ? 'mt-2' : 'mt-2.5';
  const legendGap = dense ? 'gap-2.5 sm:gap-3' : 'gap-3 sm:gap-3.5';
  const bodyMt = dense ? 'mt-2' : 'mt-2.5';
  const iconBox = dense ? 'w-5 h-5' : 'w-6 h-6';
  const titleText = dense ? 'text-xs' : 'text-sm';
  return (
    <fieldset
      className={[
        `relative ${r} border border-slate-100 dark:border-slate-800/60`,
        'bg-slate-50/40 dark:bg-slate-800/20',
        pad,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <legend className="px-2 -ml-1">
        <span className={`inline-flex items-center ${legendGap}`}>
          {icon && (
            <span
              className={`flex items-center justify-center ${iconBox} ${r} bg-linear-to-br from-emerald-500 to-teal-500 text-white shrink-0`}
            >
              {icon}
            </span>
          )}
          <span
            className={`${titleText} font-semibold text-slate-700 dark:text-slate-200 tracking-tight`}
          >
            {title}
          </span>
        </span>
      </legend>
      {description && (
        <p
          className={[
            'text-xs text-slate-500 dark:text-slate-400',
            descMt,
            descMb,
            descriptionClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {description}
        </p>
      )}
      <div className={`${bodyMt} flex min-h-0 flex-1 flex-col`}>{children}</div>
    </fieldset>
  );
};

export default FormSection;
