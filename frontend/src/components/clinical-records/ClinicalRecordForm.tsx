import { useState, type FormEvent } from 'react';
import { Textarea, Button } from '../ui';
import type { ClinicalRecord, UpdateClinicalRecordDto } from '../../types';

interface ClinicalRecordFormProps {
  initialData?: ClinicalRecord;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (data: UpdateClinicalRecordDto) => void;
  onCancel?: () => void;
}

const SECTIONS = [
  { key: 'medicalBackground' as const, label: 'Antecedentes Médicos' },
  { key: 'dentalBackground' as const, label: 'Antecedentes Odontológicos' },
  { key: 'consultationReason' as const, label: 'Motivo de Consulta' },
  { key: 'diagnosis' as const, label: 'Diagnóstico' },
  { key: 'observations' as const, label: 'Observaciones' },
];

const ClinicalRecordForm = ({
  initialData,
  loading = false,
  submitLabel = 'Guardar',
  onSubmit,
  onCancel,
}: ClinicalRecordFormProps) => {
  const [medicalBackground, setMedicalBackground] = useState(initialData?.medicalBackground || '');
  const [dentalBackground, setDentalBackground] = useState(initialData?.dentalBackground || '');
  const [consultationReason, setConsultationReason] = useState(initialData?.consultationReason || '');
  const [diagnosis, setDiagnosis] = useState(initialData?.diagnosis || '');
  const [observations, setObservations] = useState(initialData?.observations || '');

  const setters: Record<typeof SECTIONS[number]['key'], (v: string) => void> = {
    medicalBackground: setMedicalBackground,
    dentalBackground: setDentalBackground,
    consultationReason: setConsultationReason,
    diagnosis: setDiagnosis,
    observations: setObservations,
  };

  const values: Record<typeof SECTIONS[number]['key'], string> = {
    medicalBackground,
    dentalBackground,
    consultationReason,
    diagnosis,
    observations,
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      medicalBackground: medicalBackground.trim() || undefined,
      dentalBackground: dentalBackground.trim() || undefined,
      consultationReason: consultationReason.trim() || undefined,
      diagnosis: diagnosis.trim() || undefined,
      observations: observations.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {SECTIONS.map((s) => (
        <Textarea
          key={s.key}
          label={s.label}
          value={values[s.key]}
          onChange={(e) => setters[s.key](e.target.value)}
          rows={3}
        />
      ))}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ClinicalRecordForm;
