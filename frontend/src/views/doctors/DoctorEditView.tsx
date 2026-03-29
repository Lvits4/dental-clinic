import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, PageHeader, Spinner, ConfirmDialog, ToggleSwitch } from '../../components/ui';
import DoctorForm from '../../components/doctors/DoctorForm';
import { useDoctorDetail } from '../../querys/doctors/queryDoctors';
import { useUpdateDoctor, useToggleDoctorStatus } from '../../querys/doctors/mutationDoctors';

const DoctorEditView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: doctor, isLoading } = useDoctorDetail(id!);
  const updateMutation = useUpdateDoctor(id!);
  const toggleStatusMutation = useToggleDoctorStatus(id!);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);

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

  const handleToggleRequest = (newStatus: boolean) => {
    setPendingStatus(newStatus);
    setShowToggleDialog(true);
  };

  const handleToggleConfirm = () => {
    toggleStatusMutation.mutate(pendingStatus, {
      onSuccess: () => setShowToggleDialog(false),
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Editar: Dr. ${doctor.firstName} ${doctor.lastName}`}
        breadcrumb={[
          { label: 'Doctores', to: '/doctors' },
          { label: `Dr. ${doctor.firstName} ${doctor.lastName}` },
        ]}
      />

      {/* Status banner */}
      <div
        className={[
          'flex items-center justify-between gap-4 px-4 py-3 rounded-lg border',
          doctor.isActive
            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40'
            : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40',
        ].join(' ')}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={[
              'w-2 h-2 rounded-lg shrink-0',
              doctor.isActive
                ? 'bg-emerald-500'
                : 'bg-amber-500',
            ].join(' ')}
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {doctor.isActive
              ? 'Este doctor está activo y aparece en las listas de selección'
              : 'Este doctor está inactivo y no aparece en las listas de selección'}
          </span>
        </div>
        <ToggleSwitch
          checked={doctor.isActive}
          onChange={handleToggleRequest}
          label={doctor.isActive ? 'Activo' : 'Inactivo'}
          size="sm"
          disabled={toggleStatusMutation.isPending}
        />
      </div>

      <Card>
        <DoctorForm
          initialData={doctor}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
          submitLabel="Guardar Cambios"
          onCancel={() => navigate(-1)}
        />
      </Card>

      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleConfirm}
        title={pendingStatus ? 'Activar doctor' : 'Desactivar doctor'}
        message={
          pendingStatus
            ? `¿Deseas activar al Dr. ${doctor.firstName} ${doctor.lastName}? Volverá a aparecer en las listas de selección.`
            : `¿Deseas desactivar al Dr. ${doctor.firstName} ${doctor.lastName}? No será eliminado, solo se marcará como inactivo.`
        }
        confirmLabel={pendingStatus ? 'Activar' : 'Desactivar'}
        loading={toggleStatusMutation.isPending}
      />
    </div>
  );
};

export default DoctorEditView;
