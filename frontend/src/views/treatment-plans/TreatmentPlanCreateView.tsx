import { PageHeader, Spinner } from '../../components/ui';
import TreatmentPlanForm from '../../components/treatment-plans/TreatmentPlanForm';
import { useCreateTreatmentPlan } from '../../querys/treatment-plans/mutationTreatmentPlans';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';

const TreatmentPlanCreateView = () => {
  const createMutation = useCreateTreatmentPlan();
  const { data: patientsData, isLoading: lp } = usePatientsList({ limit: 500 });
  const { data: doctors, isLoading: ld } = useDoctorsList();

  if (lp || ld) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const patients = (patientsData?.data || []).filter((p) => p.isActive);
  const activeDoctors = (doctors || []).filter((d) => d.isActive);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Plan de Tratamiento"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Planes de Tratamiento', to: '/treatment-plans' },
          { label: 'Nuevo' },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <TreatmentPlanForm
          patients={patients}
          doctors={activeDoctors}
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Crear Plan"
        />
      </div>
    </div>
  );
};

export default TreatmentPlanCreateView;
