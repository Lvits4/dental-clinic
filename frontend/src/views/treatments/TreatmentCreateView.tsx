import { PageHeader } from '../../components/ui';
import TreatmentForm from '../../components/treatments/TreatmentForm';
import { useCreateTreatment } from '../../querys/treatments/mutationTreatments';

const TreatmentCreateView = () => {
  const createMutation = useCreateTreatment();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Tratamiento"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Tratamientos', to: '/treatments' },
          { label: 'Nuevo' },
        ]}
      />

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <TreatmentForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Crear Tratamiento"
        />
      </div>
    </div>
  );
};

export default TreatmentCreateView;
