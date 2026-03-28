import { Card, PageHeader } from '../../components/ui';
import PatientForm from '../../components/patients/PatientForm';
import { useCreatePatient } from '../../querys/patients/mutationPatients';

const PatientCreateView = () => {
  const createMutation = useCreatePatient();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Paciente"
        breadcrumb={[
          { label: 'Pacientes', to: '/patients' },
          { label: 'Nuevo' },
        ]}
      />

      <Card>
        <PatientForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Crear Paciente"
        />
      </Card>
    </div>
  );
};

export default PatientCreateView;
