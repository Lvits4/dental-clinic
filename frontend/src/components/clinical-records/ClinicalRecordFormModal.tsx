import toast from 'react-hot-toast';
import { Modal } from '../ui';
import ClinicalRecordForm from './ClinicalRecordForm';
import { useCreateClinicalRecord, useUpdateClinicalRecord } from '../../querys/clinical-records/mutationClinicalRecords';
import type { ClinicalRecord, UpdateClinicalRecordDto } from '../../types';

export type ClinicalRecordFormModalMode = 'create' | 'edit';

export interface ClinicalRecordFormModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  mode: ClinicalRecordFormModalMode;
  /** En modo edit debe existir el expediente ya cargado en el padre */
  record?: ClinicalRecord | null;
}

const ClinicalRecordFormModal = ({
  patientId,
  isOpen,
  onClose,
  mode,
  record,
}: ClinicalRecordFormModalProps) => {
  const createMutation = useCreateClinicalRecord();
  const updateMutation = useUpdateClinicalRecord(record?.id ?? '', patientId);

  const title =
    mode === 'create' ? 'Crear expediente clínico' : 'Editar expediente clínico';

  const handleSubmit = (data: UpdateClinicalRecordDto) => {
    if (mode === 'edit' && record) {
      updateMutation.mutate(data, { onSuccess: () => onClose() });
    } else {
      createMutation.mutate({ patientId, ...data }, { onSuccess: () => onClose() });
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  if (mode === 'edit' && !record) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size="lg"
        fitContent
        panelClassName="min-h-[min(28rem,52dvh)] w-full md:min-h-[min(32rem,50dvh)]"
      >
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
          No se pudo cargar el expediente.
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      fitContent
      panelClassName="min-h-[min(28rem,52dvh)] w-full md:min-h-[min(32rem,50dvh)]"
    >
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden md:min-h-[min(22rem,50dvh)]">
        <ClinicalRecordForm
          fillParent
          initialData={mode === 'edit' ? record ?? undefined : undefined}
          loading={loading}
          submitLabel={mode === 'create' ? 'Crear expediente' : 'Guardar'}
          onSubmit={handleSubmit}
          onUnchanged={
            mode === 'edit'
              ? () => {
                  toast('No hay cambios que guardar', { duration: 2800 });
                  onClose();
                }
              : undefined
          }
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};

export default ClinicalRecordFormModal;
