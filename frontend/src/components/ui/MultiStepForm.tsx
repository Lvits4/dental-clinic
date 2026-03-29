import { useState, type ReactNode, type FormEvent } from 'react';

export interface Step {
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  /** Optional per-step validation. Return true if valid. */
  validate?: () => boolean;
}

export interface MultiStepFormProps {
  steps: Step[];
  onSubmit: (e: FormEvent) => void;
  submitLabel?: string;
  loading?: boolean;
}

const MultiStepForm = ({
  steps,
  onSubmit,
  submitLabel = 'Guardar',
  loading = false,
}: MultiStepFormProps) => {
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;

  const goNext = () => {
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
  };

  const goBack = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Step Indicator ── */}
      <div className="mb-6">
        {/* Desktop indicator */}
        <div className="hidden sm:flex items-center gap-1">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <button
                  type="button"
                  onClick={() => {
                    if (i < current) setCurrent(i);
                  }}
                  className={[
                    'flex items-center gap-2 transition-all duration-200',
                    i < current ? 'cursor-pointer' : 'cursor-default',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                      done
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : active
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 scale-110'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
                    ].join(' ')}
                  >
                    {done ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={[
                      'text-xs font-medium whitespace-nowrap transition-colors duration-200',
                      active
                        ? 'text-slate-800 dark:text-white'
                        : done
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500',
                    ].join(' ')}
                  >
                    {step.title}
                  </span>
                </button>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                      style={{ width: done ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile indicator — compact */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-white">
              {steps[current].title}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Paso {current + 1} de {steps.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((current + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="min-h-[200px]">
        <div
          key={current}
          className="animate-[fadeSlideIn_0.3s_ease-out]"
        >
          {steps[current].content}
        </div>
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
        {/* Back button */}
        <div>
          {!isFirst && (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
          )}
        </div>

        {/* Next / Submit */}
        <div className="ml-auto">
          {isLast ? (
            <button
              type="submit"
              disabled={loading}
              className={[
                'inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200',
                'bg-gradient-to-r from-emerald-500 to-teal-500',
                'hover:from-emerald-600 hover:to-teal-600',
                'shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0',
                'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md',
              ].join(' ')}
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className={[
                'inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200',
                'bg-gradient-to-r from-emerald-500 to-teal-500',
                'hover:from-emerald-600 hover:to-teal-600',
                'shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0',
              ].join(' ')}
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default MultiStepForm;
