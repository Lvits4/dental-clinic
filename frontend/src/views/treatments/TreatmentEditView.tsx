import { useParams } from 'react-router-dom';
import { PageHeader, Spinner } from '../../components/ui';
import TreatmentForm from '../../components/treatments/TreatmentForm';
import { useTreatmentDetail } from '../../querys/treatments/queryTreatments';
import { useUpdateTreatment } from '../../querys/treatments/mutationTreatments';

const TreatmentEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: treatment, isLoading } = useTreatmentDetail(id!);
  const updateMutation = useUpdateTreatment(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Tratamiento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Editar: ${treatment.name}`}
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Tratamientos', to: '/treatments' },
          { label: treatment.name },
        ]}
      />

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
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
