import { useEffect, type ReactNode } from 'react';

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
  /** Clases extra en el panel (p. ej. tope de ancho). */
  panelClassName?: string;
}

const desktopSizeClasses: Record<ModalSize, string> = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-xl',
  fullscreen: 'md:max-w-4xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  fitContent = false,
  panelClassName = '',
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isFullscreen = size === 'fullscreen';

  const panelRounded = fitContent
    ? 'rounded-t-lg md:rounded-lg'
    : 'rounded-t-2xl md:rounded-2xl';

  const footerRounded = fitContent ? 'rounded-b-lg' : 'rounded-b-2xl';

  const closeBtnRounded = fitContent ? 'rounded-lg' : 'rounded-xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'relative w-full',
          fitContent ? 'md:w-max md:min-w-0' : '',
          'bg-white dark:bg-slate-900',
          'border border-slate-200/80 dark:border-slate-800',
          'flex flex-col',
          panelRounded,
          'max-h-[92dvh] md:max-h-[90vh]',
          'overflow-hidden',
          'shadow-2xl',
          desktopSizeClasses[size],
          !fitContent && isFullscreen ? 'md:min-h-[80vh]' : '',
          'animate-slide-up md:animate-fade-in',
          panelClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Handle (solo mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
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

        {/* Body */}
        <div
          className={[
            'px-6 py-5 overflow-y-auto min-h-0',
            fitContent
              ? 'max-h-[calc(92dvh-7rem)] md:max-h-[calc(90vh-6.5rem)]'
              : 'flex-1',
          ].join(' ')}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-800/20 ${footerRounded}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
