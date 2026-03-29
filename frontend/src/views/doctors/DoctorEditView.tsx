import { useParams } from 'react-router-dom';
import { PageHeader, Spinner } from '../../components/ui';
import DoctorForm from '../../components/doctors/DoctorForm';
import { useDoctorDetail } from '../../querys/doctors/queryDoctors';
import { useUpdateDoctor } from '../../querys/doctors/mutationDoctors';

const DoctorEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: doctor, isLoading } = useDoctorDetail(id!);
  const updateMutation = useUpdateDoctor(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Doctor no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Editar: Dr. ${doctor.firstName} ${doctor.lastName}`}
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Doctores', to: '/doctors' },
          { label: `Dr. ${doctor.firstName} ${doctor.lastName}`, to: `/doctors/${id}` },
          { label: 'Editar' },
        ]}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <DoctorForm
          initialData={doctor}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
          submitLabel="Guardar Cambios"
        />
      </div>
    </div>
  );
};

export default DoctorEditView;
