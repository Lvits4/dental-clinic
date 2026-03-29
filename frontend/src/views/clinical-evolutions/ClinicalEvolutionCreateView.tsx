import { useParams } from 'react-router-dom';
import { PageHeader, Spinner } from '../../components/ui';
import ClinicalEvolutionForm from '../../components/clinical-evolutions/ClinicalEvolutionForm';
import { useCreateClinicalEvolution } from '../../querys/clinical-evolutions/mutationClinicalEvolutions';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';

const ClinicalEvolutionCreateView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId!);
  const { data: doctors, isLoading: loadingDoctors } = useDoctorsList();
  const createMutation = useCreateClinicalEvolution(patientId!);

  if (loadingRecord || loadingDoctors) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nueva Evolución"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Pacientes', to: '/patients' },
          { label: 'Paciente', to: `/patients/${patientId}` },
          { label: 'Evoluciones', to: `/patients/${patientId}/evolutions` },
          { label: 'Nueva' },
        ]}
      />

      {!record ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Este paciente no tiene expediente clínico. Debe crearlo primero.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <ClinicalEvolutionForm
            clinicalRecordId={record.id}
            doctors={doctors || []}
            loading={createMutation.isPending}
            onSubmit={(data) => createMutation.mutate(data)}
          />
        </div>
      )}
    </div>
  );
};

export default ClinicalEvolutionCreateView;
