import { useState, useCallback, type FormEvent } from 'react';
import {
  Select,
  Textarea,
  DatePicker,
  FormSection,
  MultiStepForm,
} from '../ui';
import type { Step } from '../ui';
import type { CreateClinicalEvolutionDto, Doctor } from '../../types';

interface ClinicalEvolutionFormProps {
  clinicalRecordId: string;
  doctors: Doctor[];
  loading?: boolean;
  onSubmit: (data: CreateClinicalEvolutionDto) => void;
  onCancel?: () => void;
  /** Para modales: el formulario llena el alto y solo el paso hace scroll */
  fillParent?: boolean;
}

/* ── Iconos de sección ── */
const IconInfo = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconClipboard = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const IconNote = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ClinicalEvolutionForm = ({
  clinicalRecordId,
  doctors,
  loading = false,
  onSubmit,
  onCancel,
  fillParent = false,
}: ClinicalEvolutionFormProps) => {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [consultationReason, setConsultationReason] = useState('');
  const [findings, setFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [procedurePerformed, setProcedurePerformed] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [observations, setObservations] = useState('');

  const doctorOptions = doctors
    .filter((d) => d.isActive)
    .map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }));

  const validateStep1 = useCallback(() => {
    return !!doctorId && !!date;
  }, [doctorId, date]);

  const validateStep2 = useCallback(() => {
    return !!consultationReason.trim() && !!findings.trim() && !!diagnosis.trim() && !!procedurePerformed.trim();
  }, [consultationReason, findings, diagnosis, procedurePerformed]);

  const handleSubmit = (_e: FormEvent) => {
    onSubmit({
      clinicalRecordId,
      doctorId,
      date: `${date}T00:00:00`,
      consultationReason: consultationReason.trim(),
      findings: findings.trim(),
      diagnosis: diagnosis.trim(),
      procedurePerformed: procedurePerformed.trim(),
      recommendations: recommendations.trim() || undefined,
      observations: observations.trim() || undefined,
    });
  };

  const steps: Step[] = [
    {
      title: 'General',
      validate: validateStep1,
      content: (
        <FormSection title="Información General" icon={<IconInfo />} description="Doctor y fecha de la evolución">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Doctor *"
              options={doctorOptions}
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="Seleccionar doctor..."
            />
            <DatePicker
              label="Fecha *"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Evaluación',
      validate: validateStep2,
      content: (
        <FormSection title="Evaluación Clínica" icon={<IconClipboard />} description="Hallazgos, diagnóstico y procedimiento">
          <div className="space-y-4">
            <Textarea
              label="Motivo de consulta *"
              value={consultationReason}
              onChange={(e) => setConsultationReason(e.target.value)}
              rows={2}
              className="max-h-24 min-h-16 sm:max-h-28"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
              <Textarea
                label="Hallazgos *"
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                rows={2}
                className="max-h-24 min-h-16 sm:max-h-28"
              />
              <Textarea
                label="Diagnóstico *"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={2}
                className="max-h-24 min-h-16 sm:max-h-28"
              />
            </div>
            <Textarea
              label="Procedimiento realizado *"
              value={procedurePerformed}
              onChange={(e) => setProcedurePerformed(e.target.value)}
              rows={2}
              className="max-h-24 min-h-16 sm:max-h-28"
            />
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Notas',
      content: (
        <FormSection title="Notas Adicionales" icon={<IconNote />} description="Recomendaciones y observaciones">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Recomendaciones"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              rows={3}
            />
            <Textarea
              label="Observaciones"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
            />
          </div>
        </FormSection>
      ),
    },
  ];

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      submitLabel="Registrar Evolución"
      loading={loading}
      onCancel={onCancel}
      fillParent={fillParent}
    />
  );
};

export default ClinicalEvolutionForm;
