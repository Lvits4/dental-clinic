import { useState, type FormEvent } from 'react';
import { Textarea, FormSection, MultiStepForm } from '../ui';
import type { Step } from '../ui';
import type { ClinicalRecord, UpdateClinicalRecordDto } from '../../types';

interface ClinicalRecordFormProps {
  initialData?: ClinicalRecord;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (data: UpdateClinicalRecordDto) => void;
  onCancel?: () => void;
}

/* ── Iconos de sección ── */
const IconHistory = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconDiagnosis = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

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

  const handleSubmit = (_e: FormEvent) => {
    onSubmit({
      medicalBackground: medicalBackground.trim() || undefined,
      dentalBackground: dentalBackground.trim() || undefined,
      consultationReason: consultationReason.trim() || undefined,
      diagnosis: diagnosis.trim() || undefined,
      observations: observations.trim() || undefined,
    });
  };

  const steps: Step[] = [
    {
      title: 'Antecedentes',
      content: (
        <FormSection title="Antecedentes" icon={<IconHistory />} description="Historial médico y odontológico del paciente">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Antecedentes Médicos"
              value={medicalBackground}
              onChange={(e) => setMedicalBackground(e.target.value)}
              rows={4}
            />
            <Textarea
              label="Antecedentes Odontológicos"
              value={dentalBackground}
              onChange={(e) => setDentalBackground(e.target.value)}
              rows={4}
            />
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Evaluación',
      content: (
        <FormSection title="Evaluación" icon={<IconDiagnosis />} description="Consulta, diagnóstico y observaciones">
          <div className="space-y-4">
            <Textarea
              label="Motivo de Consulta"
              value={consultationReason}
              onChange={(e) => setConsultationReason(e.target.value)}
              rows={3}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Diagnóstico"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={3}
              />
              <Textarea
                label="Observaciones"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </FormSection>
      ),
    },
  ];

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      loading={loading}
      onCancel={onCancel}
    />
  );
};

export default ClinicalRecordForm;
