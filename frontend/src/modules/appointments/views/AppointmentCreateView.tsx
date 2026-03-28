import { Link } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm/AppointmentForm';
import { useCreateAppointment } from '../hooks/useCreateAppointment';
import { usePatientsList } from '../../patients/hooks/usePatientsList';
import { useDoctorsList } from '../../doctors/hooks/useDoctorsList';
import Spinner from '../../../common/components/Spinner/Spinner';

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
      <div className="flex items-center gap-2">
        <Link
          to="/appointments"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Cita</h1>
      </div>

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
