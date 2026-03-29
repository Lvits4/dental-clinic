import { PageHeader } from '../../components/ui';
import DoctorForm from '../../components/doctors/DoctorForm';
import { useCreateDoctor } from '../../querys/doctors/mutationDoctors';

const DoctorCreateView = () => {
  const createMutation = useCreateDoctor();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Doctor"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Doctores', to: '/doctors' },
          { label: 'Nuevo' },
        ]}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <DoctorForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Crear Doctor"
        />
      </div>
    </div>
  );
};

export default DoctorCreateView;
