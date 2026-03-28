import { PageHeader, Spinner } from '../../components/ui';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { useCreateAppointment } from '../../querys/appointments/mutationAppointments';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';

const AppointmentCreateView = () => {
  const createMutation = useCreateAppointment();
  const { data: patientsData, isLoading: loadingPatients } = usePatientsList({ limit: 500 });
  const { data: doctors, isLoading: loadingDoctors } = useDoctorsList();

  if (loadingPatients || loadingDoctors) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nueva Cita"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Citas', to: '/appointments' },
          { label: 'Nueva' },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <AppointmentForm
          patients={(patientsData?.data || []).filter((p) => p.isActive)}
          doctors={(doctors || []).filter((d) => d.isActive)}
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Crear Cita"
        />
      </div>
    </div>
  );
};

export default AppointmentCreateView;
