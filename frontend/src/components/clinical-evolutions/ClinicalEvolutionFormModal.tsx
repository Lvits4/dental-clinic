import { Modal, Spinner, FormModalScrollShell } from '../ui';
import ClinicalEvolutionForm from './ClinicalEvolutionForm';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { useCreateClinicalEvolution } from '../../querys/clinical-evolutions/mutationClinicalEvolutions';

export interface ClinicalEvolutionFormModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClinicalEvolutionFormModal = ({
  patientId,
  isOpen,
  onClose,
}: ClinicalEvolutionFormModalProps) => {
  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId);
  const { data: doctors, isLoading: loadingDoctors } = useDoctorsList();
  const createMutation = useCreateClinicalEvolution(patientId, { skipNavigation: true });

  const loading = loadingRecord || loadingDoctors;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva evolución clínica"
      size="md"
      containBodyHeight
      surfaceRounding="compact"
      panelClassName="min-h-[min(28rem,52dvh)] md:min-h-[min(32rem,50dvh)]"
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !record ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
          Este paciente no tiene expediente clínico. Cree el expediente primero.
        </p>
      ) : (
        <FormModalScrollShell>
          <ClinicalEvolutionForm
            fillParent
            clinicalRecordId={record.id}
            doctors={doctors || []}
            loading={createMutation.isPending}
            onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => onClose() })}
            onCancel={onClose}
          />
        </FormModalScrollShell>
      )}
    </Modal>
  );
};

export default ClinicalEvolutionFormModal;
