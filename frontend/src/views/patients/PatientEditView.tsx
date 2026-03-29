import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, PageHeader, Spinner, ConfirmDialog, ToggleSwitch } from '../../components/ui';
import PatientForm from '../../components/patients/PatientForm';
import { usePatientDetail } from '../../querys/patients/queryPatients';
import { useUpdatePatient, useTogglePatientStatus } from '../../querys/patients/mutationPatients';

const PatientEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: patient, isLoading } = usePatientDetail(id!);
  const updateMutation = useUpdatePatient(id!);
  const toggleStatusMutation = useTogglePatientStatus(id!);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);

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
        title={`Editar: ${patient.firstName} ${patient.lastName}`}
        breadcrumb={[
          { label: 'Pacientes', to: '/patients' },
          { label: `${patient.firstName} ${patient.lastName}`, to: `/patients/${id}` },
          { label: 'Editar' },
        ]}
      />

      {/* Status banner */}
      <div
        className={[
          'flex items-center justify-between gap-4 px-4 py-3 rounded-xl border',
          patient.isActive
            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40'
            : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40',
        ].join(' ')}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={[
              'w-2 h-2 rounded-full shrink-0',
              patient.isActive
                ? 'bg-emerald-500'
                : 'bg-amber-500',
            ].join(' ')}
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {patient.isActive
              ? 'Este paciente está activo y aparece en las listas de selección'
              : 'Este paciente está inactivo y no aparece en las listas de selección'}
          </span>
        </div>
        <ToggleSwitch
          checked={patient.isActive}
          onChange={handleToggleRequest}
          label={patient.isActive ? 'Activo' : 'Inactivo'}
          size="sm"
          disabled={toggleStatusMutation.isPending}
        />
      </div>

      <Card>
        <PatientForm
          initialData={patient}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
          submitLabel="Guardar Cambios"
        />
      </Card>

      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleConfirm}
        title={pendingStatus ? 'Activar paciente' : 'Desactivar paciente'}
        message={
          pendingStatus
            ? `¿Deseas activar a ${patient.firstName} ${patient.lastName}? Volverá a aparecer en las listas de selección.`
            : `¿Deseas desactivar a ${patient.firstName} ${patient.lastName}? No será eliminado, solo se marcará como inactivo.`
        }
        confirmLabel={pendingStatus ? 'Activar' : 'Desactivar'}
        loading={toggleStatusMutation.isPending}
      />
    </div>
  );
};

export default PatientEditView;
