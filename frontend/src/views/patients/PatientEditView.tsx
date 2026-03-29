import { useParams } from 'react-router-dom';
import { Card, PageHeader, Spinner } from '../../components/ui';
import PatientForm from '../../components/patients/PatientForm';
import { usePatientDetail } from '../../querys/patients/queryPatients';
import { useUpdatePatient } from '../../querys/patients/mutationPatients';

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
        <p className="text-slate-500 dark:text-slate-400">Paciente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Editar: ${patient.firstName} ${patient.lastName}`}
        breadcrumb={[
          { label: 'Pacientes', to: '/patients' },
          { label: `${patient.firstName} ${patient.lastName}`, to: `/patients/${id}` },
          { label: 'Editar' },
        ]}
      />

      <Card>
        <PatientForm
          initialData={patient}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
          submitLabel="Guardar Cambios"
        />
      </Card>
    </div>
  );
};

export default PatientEditView;
