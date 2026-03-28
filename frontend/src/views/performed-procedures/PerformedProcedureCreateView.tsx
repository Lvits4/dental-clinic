import { PageHeader, Spinner } from '../../components/ui';
import PerformedProcedureForm from '../../components/performed-procedures/PerformedProcedureForm';
import { useCreatePerformedProcedure } from '../../querys/performed-procedures/mutationPerformedProcedures';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { useTreatmentsList } from '../../querys/treatments/queryTreatments';

const PerformedProcedureCreateView = () => {
  const createMutation = useCreatePerformedProcedure();
  const { data: patientsData, isLoading: lp } = usePatientsList({ limit: 500 });
  const { data: doctors, isLoading: ld } = useDoctorsList();
  const { data: treatments, isLoading: lt } = useTreatmentsList();

  if (lp || ld || lt) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Procedimiento"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Procedimientos Realizados', to: '/performed-procedures' },
          { label: 'Nuevo' },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <PerformedProcedureForm
          patients={patientsData?.data || []}
          doctors={doctors || []}
          treatments={treatments || []}
          loading={createMutation.isPending}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      </div>
    </div>
  );
};

export default PerformedProcedureCreateView;
