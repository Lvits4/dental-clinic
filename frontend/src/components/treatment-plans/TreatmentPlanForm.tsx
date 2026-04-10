import { useState, type FormEvent, type ReactNode } from 'react';
import { Input, Select, Textarea, Button, FormSection, FormActionBar } from '../ui';
import type { CreateTreatmentPlanDto, Patient, Doctor } from '../../types';
import { treatmentPlanEditUnchanged } from '../../utils/editUnchangedCompare';

interface TreatmentPlanFormErrors {
  patientId?: string;
  doctorId?: string;
  title?: string;
}

function validatePlan(data: CreateTreatmentPlanDto): TreatmentPlanFormErrors {
  const errors: TreatmentPlanFormErrors = {};
  if (!data.patientId) errors.patientId = 'Debe seleccionar un paciente';
  if (!data.doctorId) errors.doctorId = 'Debe seleccionar un doctor';
  if (!data.title?.trim()) errors.title = 'El título es requerido';
  return errors;
}

interface TreatmentPlanFormProps {
  patients: Patient[];
  doctors: Doctor[];
  onSubmit: (data: CreateTreatmentPlanDto) => void;
  loading?: boolean;
  submitLabel?: string;
  initialPatientId?: string;
  initialDoctorId?: string;
  initialTitle?: string;
  initialObservations?: string;
  /** En modo edición, proporciona el plan completo para detectar cambios */
  initialPlan?: { patientId: string; doctorId: string; title: string; observations?: string };
  onUnchanged?: () => void;
  footerContent?: ReactNode;
  onCancel?: () => void;
  fillParent?: boolean;
}

/* ── Icono de sección ── */
const IconPlan = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const TreatmentPlanForm = ({
  patients,
  doctors,
  onSubmit,
  loading = false,
  submitLabel = 'Crear Plan',
  initialPatientId,
  initialDoctorId,
  initialTitle,
  initialObservations,
  initialPlan,
  onUnchanged,
  footerContent,
  onCancel,
  fillParent = false,
}: TreatmentPlanFormProps) => {
  const [patientId, setPatientId] = useState(initialPatientId ?? '');
  const [doctorId, setDoctorId] = useState(initialDoctorId ?? '');
  const [title, setTitle] = useState(initialTitle ?? '');
  const [observations, setObservations] = useState(initialObservations ?? '');
  const [errors, setErrors] = useState<TreatmentPlanFormErrors>({});

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: CreateTreatmentPlanDto = {
      patientId,
      doctorId,
      title: title.trim(),
      observations: observations.trim() || undefined,
    };
    const validationErrors = validatePlan(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (initialPlan && treatmentPlanEditUnchanged(initialPlan as any, data)) {
      onUnchanged?.();
      return;
    }
    onSubmit(data);
  };

  const iconClose = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

const fields = (
    <>
      <FormSection
        title="Plan de Tratamiento"
        icon={<IconPlan />}
        description="Seleccione el paciente y doctor responsable"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Paciente *"
            options={patientOptions}
            value={patientId}
            onChange={(e) => { setPatientId(e.target.value); setErrors((p) => ({ ...p, patientId: undefined })); }}
            error={errors.patientId}
            placeholder="Seleccionar paciente..."
          />
          <Select
            label="Doctor *"
            options={doctorOptions}
            value={doctorId}
            onChange={(e) => { setDoctorId(e.target.value); setErrors((p) => ({ ...p, doctorId: undefined })); }}
            error={errors.doctorId}
            placeholder="Seleccionar doctor..."
          />
        </div>
        <div className="mt-4">
          <Input
            label="Título *"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
            error={errors.title}
            placeholder="Ej: Plan de ortodoncia, Blanqueamiento dental..."
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Observaciones"
            placeholder="Observaciones generales del plan..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={3}
          />
        </div>
      </FormSection>
      {footerContent}
    </>
  );

  const actions = onCancel ? (
    <FormActionBar
      left={<Button type="button" variant="secondary" size="md" leftIcon={iconClose} onClick={onCancel} disabled={loading}>Cancelar</Button>}
      right={<Button type="submit" size="md" loading={loading}>{submitLabel}</Button>}
    />
  ) : (
    <FormActionBar end={<Button type="submit" size="md" loading={loading}>{submitLabel}</Button>} />
  );

  if (fillParent) {
    return (
      <form onSubmit={handleSubmit} className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden pr-0.5">{fields}</div>
        {actions}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields}
      {actions}
    </form>
  );
};

export default TreatmentPlanForm;
