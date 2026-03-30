import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card } from '../../components/ui';
import ClinicalEvolutionForm from '../../components/clinical-evolutions/ClinicalEvolutionForm';
import { useCreateClinicalEvolution } from '../../querys/clinical-evolutions/mutationClinicalEvolutions';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';

const FormSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="rounded-md bg-slate-100 dark:bg-slate-800 h-10 w-48" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 rounded-md bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
    <div className="h-px bg-slate-100 dark:bg-slate-800" />
    <div className="flex justify-end">
      <div className="h-10 w-32 rounded-md bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);

const ClinicalEvolutionCreateView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId!);
  const { data: doctors, isLoading: loadingDoctors } = useDoctorsList();
  const createMutation = useCreateClinicalEvolution(patientId!);

  const loading = loadingRecord || loadingDoctors;

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

      <Card>
        {loading ? (
          <FormSkeleton />
        ) : !record ? (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">
              Este paciente no tiene expediente clínico. Debe crearlo primero.
            </p>
          </div>
        ) : (
          <ClinicalEvolutionForm
            clinicalRecordId={record.id}
            doctors={doctors || []}
            loading={createMutation.isPending}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => navigate(-1)}
          />
        )}
      </Card>
    </div>
  );
};

export default ClinicalEvolutionCreateView;
