import { Link } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import { useCreatePatient } from '../hooks/useCreatePatient';

export default function PatientCreateView() {
  const createMutation = useCreatePatient();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          to="/patients"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Paciente</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <PatientForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Crear Paciente"
        />
      </div>
    </div>
  );
}
