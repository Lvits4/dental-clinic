import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TreatmentForm from '../components/TreatmentForm/TreatmentForm';
import { useUpdateTreatment } from '../hooks/useUpdateTreatment';
import { treatmentsApi } from '../requests/treatments.api';
import Spinner from '../../../common/components/Spinner/Spinner';

const TreatmentEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: treatment, isLoading } = useQuery({
    queryKey: ['treatments', id],
    queryFn: () => treatmentsApi.getById(id!),
    enabled: !!id,
  });
  const updateMutation = useUpdateTreatment(id!);

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (!treatment) return <div className="text-center py-12"><p className="text-gray-500 dark:text-gray-400">Tratamiento no encontrado</p></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/treatments" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar: {treatment.name}</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <TreatmentForm
          initialData={treatment}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
          submitLabel="Guardar Cambios"
        />
      </div>
    </div>
  );
};

export default TreatmentEditView;
