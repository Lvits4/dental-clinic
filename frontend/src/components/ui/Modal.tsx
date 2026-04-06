import { useEffect, useState, type ReactNode, type TransitionEvent } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  /** Panel que encaja al contenido (sin min-height forzada; ancho hasta max del size). */
  fitContent?: boolean;
  /**
   * true: el cuerpo no hace scroll; el hijo debe usar flex-1/min-h-0 y scroll interno
   * (p. ej. formulario multistep con pie de acciones siempre visible).
   */
  containBodyHeight?: boolean;
  /** Clases extra en el panel (p. ej. tope de ancho). */
  panelClassName?: string;
  /** @deprecated Sin efecto: el panel siempre usa `rounded-md` (misma vista que pacientes). */
  surfaceRounding?: 'default' | 'compact';
}

const desktopSizeClasses: Record<ModalSize, string> = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-xl',
  fullscreen: 'md:max-w-4xl',
};

type Phase = 'closed' | 'open' | 'closing';

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  fitContent = false,
  containBodyHeight = false,
  panelClassName = '',
  surfaceRounding = 'compact',
}: ModalProps) => {
  void surfaceRounding;
  const [phase, setPhase] = useState<Phase>(() => (isOpen ? 'open' : 'closed'));
  const [paintOpen, setPaintOpen] = useState(false);

  useEffect(() => {
    setPhase((prev) => {
      if (isOpen) return 'open';
      if (prev === 'open') return 'closing';
      return prev;
    });
  }, [isOpen]);

  useEffect(() => {
    if (phase !== 'open') {
      setPaintOpen(false);
      return;
    }
    setPaintOpen(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPaintOpen(true));
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 'closed' || phase === 'closing') return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [phase, onClose]);

  useEffect(() => {
    if (phase === 'closed') return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  const handleBackdropTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (phase !== 'closing') return;
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== 'opacity') return;
    setPhase('closed');
  };

  if (phase === 'closed') return null;

  const closing = phase === 'closing';
  const isFullscreen = size === 'fullscreen';

  const panelRounded = 'rounded-t-md md:rounded-md';
  const footerRounded = 'rounded-b-md';
  const closeBtnRounded = 'rounded-md';
  const handleBarRounded = 'rounded-md';

  const backdropClass =
    closing || !paintOpen ? 'opacity-0' : 'opacity-100';
  const panelSettled = closing
    ? 'opacity-0 translate-y-10 md:translate-y-2 md:scale-[0.97]'
    : paintOpen
      ? 'opacity-100 translate-y-0 md:scale-100'
      : 'opacity-0 translate-y-10 md:translate-y-2 md:scale-[0.97]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${backdropClass}`}
        onClick={onClose}
        onTransitionEnd={handleBackdropTransitionEnd}
        aria-hidden="true"
      />

      <div
        className={[
          'relative w-full min-h-0 transition-all duration-200 ease-out',
          fitContent ? 'md:w-max md:min-w-0' : '',
          'bg-white dark:bg-slate-900',
          'border border-slate-200/80 dark:border-slate-800',
          'flex max-h-[92dvh] flex-col overflow-hidden md:max-h-[90vh]',
          panelRounded,
          'shadow-2xl',
          desktopSizeClasses[size],
          !fitContent && isFullscreen ? 'md:min-h-[80vh]' : '',
          panelSettled,
          panelClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className={`w-10 h-1 ${handleBarRounded} bg-slate-200 dark:bg-slate-700`} />
        </div>

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <h2
              id="modal-title"
              className="text-base font-semibold text-slate-800 dark:text-white tracking-tight"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 ${closeBtnRounded} text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200`}
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div
          className={[
            'min-h-0 flex-1 px-6 py-5',
            containBodyHeight
              ? 'flex flex-col overflow-hidden'
              : ['overflow-y-auto', fitContent ? 'flex flex-col' : ''].filter(Boolean).join(' '),
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>

        {footer && (
          <div
            className={`px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex w-full min-w-0 shrink-0 items-center bg-slate-50/50 dark:bg-slate-800/20 ${footerRounded}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
