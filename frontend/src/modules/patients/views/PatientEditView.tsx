import { Link, useParams } from 'react-router-dom';
import PatientForm from '../components/PatientForm/PatientForm';
import { usePatientDetail } from '../hooks/usePatientDetail';
import { useUpdatePatient } from '../hooks/useUpdatePatient';
import Spinner from '../../../common/components/Spinner/Spinner';

const PatientEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: patient, isLoading } = usePatientDetail(id!);
  const updateMutation = useUpdatePatient(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Paciente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          to={`/patients/${id}`}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Editar: {patient.firstName} {patient.lastName}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <PatientForm
          initialData={patient}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
          submitLabel="Guardar Cambios"
        />
      </div>
    </div>
  );
};

export default PatientEditView;
