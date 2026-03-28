import { useEffect, type ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
}

// En desktop: max-width controlado. En mobile: siempre ocupa el ancho.
const desktopSizeClasses: Record<ModalSize, string> = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  fullscreen: 'md:max-w-4xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}: ModalProps) => {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Bloquear scroll del body
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          // Mobile: desliza desde abajo, ocupa todo el ancho
          'relative w-full',
          'bg-white dark:bg-gray-900',
          'border border-gray-200 dark:border-gray-800',
          'flex flex-col',
          // Mobile: slide-up, rounded top, max height
          'rounded-t-2xl md:rounded-xl',
          'max-h-[92dvh] md:max-h-[90vh]',
          'shadow-xl',
          // Desktop: centrado, ancho controlado
          desktopSizeClasses[size],
          isFullscreen ? 'md:min-h-[80vh]' : '',
          // Animacion
          'animate-slide-up md:animate-fade-in',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Handle (solo mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <h2
              id="modal-title"
              className="text-base font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
