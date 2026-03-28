import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Badge, Button, ConfirmDialog, Spinner } from '../../components/ui';
import { useDoctorDetail } from '../../querys/doctors/queryDoctors';
import { useDeleteDoctor } from '../../querys/doctors/mutationDoctors';

const DoctorDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: doctor, isLoading } = useDoctorDetail(id!);
  const deleteMutation = useDeleteDoctor();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        <p className="text-gray-500 dark:text-gray-400">Doctor no encontrado</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        navigate('/doctors');
      },
    });
  };

  const rows = [
    { label: 'Especialidad', value: doctor.specialty },
    { label: 'Teléfono', value: doctor.phone },
    { label: 'Correo', value: doctor.email },
    { label: 'Licencia', value: doctor.licenseNumber },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Detalle de Doctor"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Doctores', to: '/doctors' },
          { label: `Dr. ${doctor.firstName} ${doctor.lastName}` },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to={`/doctors/${id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            {doctor.isActive && (
              <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
                Desactivar
              </Button>
            )}
          </div>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <Badge
            className={
              doctor.isActive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }
          >
            {doctor.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <dl className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">
                {row.label}
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Desactivar doctor"
        message={`¿Estás seguro de desactivar al Dr. ${doctor.firstName} ${doctor.lastName}?`}
        confirmLabel="Desactivar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default DoctorDetailView;
