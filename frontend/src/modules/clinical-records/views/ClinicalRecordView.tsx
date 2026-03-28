import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useClinicalRecord, useCreateClinicalRecord, useUpdateClinicalRecord } from '../hooks/useClinicalRecord';
import Textarea from '../../../common/components/Textarea/Textarea';
import Button from '../../../common/components/Button/Button';
import Spinner from '../../../common/components/Spinner/Spinner';

const ClinicalRecordView = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const { data: record, isLoading, error } = useClinicalRecord(patientId!);
  const createMutation = useCreateClinicalRecord();
  const updateMutation = useUpdateClinicalRecord(record?.id || '', patientId!);

  const [editing, setEditing] = useState(false);
  const [medicalBackground, setMedicalBackground] = useState('');
  const [dentalBackground, setDentalBackground] = useState('');
  const [consultationReason, setConsultationReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [observations, setObservations] = useState('');

  const noRecord = error && !record;

  const startEditing = () => {
    if (record) {
      setMedicalBackground(record.medicalBackground || '');
      setDentalBackground(record.dentalBackground || '');
      setConsultationReason(record.consultationReason || '');
      setDiagnosis(record.diagnosis || '');
      setObservations(record.observations || '');
    }
    setEditing(true);
  };

  const handleCreate = () => {
    createMutation.mutate({
      patientId: patientId!,
      medicalBackground: medicalBackground.trim() || undefined,
      dentalBackground: dentalBackground.trim() || undefined,
      consultationReason: consultationReason.trim() || undefined,
      diagnosis: diagnosis.trim() || undefined,
      observations: observations.trim() || undefined,
    }, { onSuccess: () => setEditing(false) });
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      medicalBackground: medicalBackground.trim() || undefined,
      dentalBackground: dentalBackground.trim() || undefined,
      consultationReason: consultationReason.trim() || undefined,
      diagnosis: diagnosis.trim() || undefined,
      observations: observations.trim() || undefined,
    }, { onSuccess: () => setEditing(false) });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const sections = [
    { label: 'Antecedentes Médicos', key: 'medicalBackground', value: medicalBackground, setter: setMedicalBackground, record: record?.medicalBackground },
    { label: 'Antecedentes Odontológicos', key: 'dentalBackground', value: dentalBackground, setter: setDentalBackground, record: record?.dentalBackground },
    { label: 'Motivo de Consulta', key: 'consultationReason', value: consultationReason, setter: setConsultationReason, record: record?.consultationReason },
    { label: 'Diagnóstico', key: 'diagnosis', value: diagnosis, setter: setDiagnosis, record: record?.diagnosis },
    { label: 'Observaciones', key: 'observations', value: observations, setter: setObservations, record: record?.observations },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link to={`/patients/${patientId}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expediente Clínico</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/patients/${patientId}/evolutions`}>
            <Button variant="ghost">Ver Evoluciones</Button>
          </Link>
          {record && !editing && (
            <Button variant="secondary" onClick={startEditing}>Editar</Button>
          )}
        </div>
      </div>

      {noRecord && !editing ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Este paciente no tiene expediente clínico aún.</p>
          <Button onClick={() => { setEditing(true); }}>Crear Expediente</Button>
        </div>
      ) : editing ? (
        <form onSubmit={record ? handleUpdate : (e) => { e.preventDefault(); handleCreate(); }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          {sections.map((s) => (
            <Textarea key={s.key} label={s.label} value={s.value} onChange={(e) => s.setter(e.target.value)} rows={3} />
          ))}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {record ? 'Guardar' : 'Crear Expediente'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          {sections.map((s) => (
            <div key={s.key}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{s.label}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{s.record || '—'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicalRecordView;
