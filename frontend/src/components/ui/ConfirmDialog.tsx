import Modal from './Modal';
import Button from './Button';
import FormActionBar from './FormActionBar';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar accion',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) => {
  const iconClose = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <FormActionBar
          variant="modalFooter"
          left={
            <Button type="button" variant="secondary" size="md" leftIcon={iconClose} onClick={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
          }
          right={
            <Button type="button" variant={variant} size="md" onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          }
        />
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
};

export default ConfirmDialog;
