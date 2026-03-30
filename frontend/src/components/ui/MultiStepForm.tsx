import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
  type MouseEvent,
} from 'react';
import Button from './Button';

export type MultiStepFormHandle = {
  /** Lleva al paso indicado (útil tras validación fallida en otro paso). */
  goToStep: (index: number) => void;
};

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
  /**
   * true: el formulario llena un padre con altura definida (p. ej. modal); el scroll queda en el paso.
   * false: crece con flex-1 en un layout flex normal.
   */
  fillParent?: boolean;
}

const MultiStepForm = forwardRef<MultiStepFormHandle, MultiStepFormProps>(function MultiStepForm(
  {
    steps,
    onSubmit,
    submitLabel = 'Guardar',
    loading = false,
    beforeButtons,
    onCancel,
    onStepChange,
    fillParent = false,
  },
  ref,
) {
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, Math.max(0, steps.length - 1)));
      setCurrent(clamped);
      onStepChangeRef.current?.(clamped);
    },
    [steps.length],
  );

  useImperativeHandle(ref, () => ({ goToStep }), [goToStep]);

  const goNext = () => {
    const next = Math.min(current + 1, steps.length - 1);
    setCurrent(next);
    onStepChangeRef.current?.(next);
  };

  const goBack = () => {
    const prev = Math.max(current - 1, 0);
    setCurrent(prev);
    onStepChangeRef.current?.(prev);
  };

  /** Envío real solo desde el botón del último paso (type=button), nunca desde submit nativo del form: evita cierres obsoletos que enviaban en el paso 2. */
  const finishLastStep = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    onSubmit(e as unknown as FormEvent<HTMLFormElement>);
  };

  const blockNativeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const formLayoutClass = fillParent
    ? 'flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden'
    : 'flex min-h-0 w-full flex-1 flex-col';

  return (
    <form
      onSubmit={blockNativeSubmit}
      onKeyDown={handleKeyDown}
      className={formLayoutClass}
    >
      {/* ── Indicador de pasos (compacto) ── */}
      <div className="mb-4 shrink-0" role="navigation" aria-label="Progreso del formulario">
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
                    onStepChangeRef.current?.(i);
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

      {/* ── Step Content (scroll; botones siempre visibles si el padre limita altura) ── */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
        <div
          key={current}
          className="animate-[fadeSlideIn_0.3s_ease-out] pb-1"
        >
          {steps[current].content}
        </div>
      </div>

      {/* ── Contenido extra antes de los botones ── */}
      {beforeButtons ? <div className="shrink-0">{beforeButtons}</div> : null}

      {/* ── Navigation Buttons ── */}
      <div className="mt-4 flex shrink-0 items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
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
              type="button"
              variant="primary"
              size="md"
              loading={loading}
              disabled={loading}
              onClick={finishLastStep}
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
});

MultiStepForm.displayName = 'MultiStepForm';

export default MultiStepForm;
