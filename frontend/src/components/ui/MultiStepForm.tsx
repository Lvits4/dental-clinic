import { useState, type ReactNode, type FormEvent } from 'react';
import Button from './Button';

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
  /** Contenido extra que se renderiza entre el paso actual y los botones de navegación */
  beforeButtons?: ReactNode;
  /** Callback para cancelar y volver atrás sin importar en qué paso se encuentre */
  onCancel?: () => void;
  /** Callback que se ejecuta cada vez que el usuario navega entre pasos */
  onStepChange?: (newStep: number) => void;
}

const MultiStepForm = ({
  steps,
  onSubmit,
  submitLabel = 'Guardar',
  loading = false,
  beforeButtons,
  onCancel,
  onStepChange,
}: MultiStepFormProps) => {
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;

  const goNext = () => {
    const next = Math.min(current + 1, steps.length - 1);
    setCurrent(next);
    onStepChange?.(next);
  };

  const goBack = () => {
    const prev = Math.max(current - 1, 0);
    setCurrent(prev);
    onStepChange?.(prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Ignorar si ya hay una petición en curso (evita doble-submit)
    if (loading) return;
    // Si NO estamos en el último paso, avanzar en lugar de enviar
    if (!isLast) {
      goNext();
      return;
    }
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    onSubmit(e);
  };

  // Prevenir que Enter envíe el formulario en TODOS los pasos.
  // Solo se debe enviar haciendo clic en el botón "Guardar" del último paso.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      // Permitir Enter en textareas (para salto de línea)
      if (target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      // En pasos intermedios, avanzar al siguiente paso
      if (!isLast) {
        goNext();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {/* ── Indicador de pasos (compacto) ── */}
      <div className="mb-5" role="navigation" aria-label="Progreso del formulario">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <p className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
            {steps[current].title}
          </p>
          <span className="shrink-0 tabular-nums text-xs text-slate-400 dark:text-slate-500">
            {current + 1}/{steps.length}
          </span>
        </div>
        <div className="flex gap-1.5">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <button
                key={i}
                type="button"
                title={step.title}
                aria-current={active ? 'step' : undefined}
                aria-label={`${step.title}${active ? ', paso actual' : done ? ', completado' : ''}`}
                onClick={() => {
                  if (i < current) {
                    setCurrent(i);
                    onStepChange?.(i);
                  }
                }}
                disabled={i > current}
                className={[
                  'min-h-[3px] min-w-0 flex-1 rounded-lg transition-[height,background-color] duration-300 ease-out',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                  active
                    ? 'h-1 bg-emerald-600 dark:bg-emerald-500'
                    : done
                      ? 'h-0.5 cursor-pointer bg-emerald-500/85 hover:bg-emerald-600 dark:bg-emerald-500/90'
                      : 'h-0.5 cursor-default bg-slate-200 dark:bg-slate-700',
                ].join(' ')}
              />
            );
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="min-h-0">
        <div
          key={current}
          className="animate-[fadeSlideIn_0.3s_ease-out]"
        >
          {steps[current].content}
        </div>
      </div>

      {/* ── Contenido extra antes de los botones ── */}
      {beforeButtons}

      {/* ── Navigation Buttons ── */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
        {/* Left: Cancelar + Anterior */}
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          {!isFirst && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
              onClick={goBack}
              disabled={loading}
            >
              Anterior
            </Button>
          )}
        </div>

        {/* Next / Submit */}
        <div className="ml-auto">
          {isLast ? (
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={loading}
            >
              {submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              rightIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              onClick={goNext}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default MultiStepForm;
