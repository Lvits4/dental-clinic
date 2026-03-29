import { useState, useCallback, useMemo, type FormEvent } from 'react';
import { Input, Select, Textarea, Spinner, DatePicker, FormSection, MultiStepForm } from '../ui';
import type { Step } from '../ui';
import type { CreatePerformedProcedureDto, Patient, Doctor, Treatment } from '../../types';

interface PerformedProcedureFormProps {
  patients: Patient[];
  doctors: Doctor[];
  treatments: Treatment[];
  loading?: boolean;
  onSubmit: (data: CreatePerformedProcedureDto) => void;
}

/* ── Iconos de sección ── */
const IconProcedure = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);
const IconNotes = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PerformedProcedureForm = ({
  patients,
  doctors,
  treatments,
  loading = false,
  onSubmit,
}: PerformedProcedureFormProps) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [treatmentId, setTreatmentId] = useState('');
  const [tooth, setTooth] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [performedAt, setPerformedAt] = useState(new Date().toISOString().split('T')[0]);

  const patientOptions = useMemo(() => patients
    .map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })), [patients]);

  const doctorOptions = useMemo(() => doctors
    .map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` })), [doctors]);

  const treatmentOptions = useMemo(() => treatments
    .filter((t) => t.isActive)
    .map((t) => ({ value: t.id, label: `${t.name} — ${t.category}` })), [treatments]);

  const validateStep1 = useCallback(() => {
    return !!patientId && !!doctorId && !!treatmentId;
  }, [patientId, doctorId, treatmentId]);

  const handleSubmit = (_e: FormEvent) => {
    onSubmit({
      patientId,
      doctorId,
      treatmentId,
      tooth: tooth.trim() || undefined,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      performedAt: `${performedAt}T00:00:00`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const steps: Step[] = [
    {
      title: 'Procedimiento',
      validate: validateStep1,
      content: (
        <FormSection title="Datos del Procedimiento" icon={<IconProcedure />} description="Paciente, doctor, tratamiento y fecha">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Paciente *"
              options={patientOptions}
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Seleccionar..."
            />
            <Select
              label="Doctor *"
              options={doctorOptions}
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="Seleccionar..."
            />
            <Select
              label="Tratamiento *"
              options={treatmentOptions}
              value={treatmentId}
              onChange={(e) => setTreatmentId(e.target.value)}
              placeholder="Seleccionar..."
            />
            <DatePicker
              label="Fecha *"
              value={performedAt}
              onChange={(e) => setPerformedAt(e.target.value)}
            />
            <Input
              label="Pieza dental"
              placeholder="Ej: 18, 21"
              value={tooth}
              onChange={(e) => setTooth(e.target.value)}
            />
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Detalles',
      content: (
        <FormSection title="Detalles" icon={<IconNotes />} description="Descripción y notas del procedimiento">
          <div className="space-y-4">
            <Textarea
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <Textarea
              label="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
      submitLabel="Registrar"
      loading={loading}
    />
  );
};

export default PerformedProcedureForm;
