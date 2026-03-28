import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader, Button, Spinner } from '../../components/ui';
import ClinicalRecordForm from '../../components/clinical-records/ClinicalRecordForm';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { useCreateClinicalRecord, useUpdateClinicalRecord } from '../../querys/clinical-records/mutationClinicalRecords';
import type { UpdateClinicalRecordDto } from '../../types';

const SECTIONS = [
  { key: 'medicalBackground' as const, label: 'Antecedentes Médicos' },
  { key: 'dentalBackground' as const, label: 'Antecedentes Odontológicos' },
  { key: 'consultationReason' as const, label: 'Motivo de Consulta' },
  { key: 'diagnosis' as const, label: 'Diagnóstico' },
  { key: 'observations' as const, label: 'Observaciones' },
];

const ClinicalRecordView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const { data: record, isLoading, error } = useClinicalRecord(patientId!);
  const createMutation = useCreateClinicalRecord();
  const updateMutation = useUpdateClinicalRecord(record?.id || '', patientId!);

  const [editing, setEditing] = useState(false);

  const noRecord = !!error && !record;

  const handleCreate = (data: UpdateClinicalRecordDto) => {
    createMutation.mutate(
      { patientId: patientId!, ...data },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleUpdate = (data: UpdateClinicalRecordDto) => {
    updateMutation.mutate(data, { onSuccess: () => setEditing(false) });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Expediente Clínico"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Pacientes', to: '/patients' },
          { label: 'Paciente', to: `/patients/${patientId}` },
          { label: 'Expediente' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to={`/patients/${patientId}/evolutions`}>
              <Button variant="ghost">Ver Evoluciones</Button>
            </Link>
            {record && !editing && (
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Editar
              </Button>
            )}
          </div>
        }
      />

      {noRecord && !editing ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Este paciente no tiene expediente clínico aún.
          </p>
          <Button onClick={() => setEditing(true)}>Crear Expediente</Button>
        </div>
      ) : editing ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <ClinicalRecordForm
            initialData={record}
            loading={createMutation.isPending || updateMutation.isPending}
            submitLabel={record ? 'Guardar' : 'Crear Expediente'}
            onSubmit={record ? handleUpdate : handleCreate}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.key}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {s.label}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {record?.[s.key] || '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicalRecordView;
