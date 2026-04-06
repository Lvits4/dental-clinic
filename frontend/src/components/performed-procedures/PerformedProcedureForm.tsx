import { useState, useCallback, useMemo, useEffect, type FormEventHandler } from 'react';
import { Input, Select, Textarea, Spinner, DatePicker, FormSection, MultiStepForm } from '../ui';
import type { Step } from '../ui';
import type { CreatePerformedProcedureDto, Patient, Doctor, Treatment, PerformedProcedure } from '../../types';
import { performedProcedureEditUnchanged } from '../../utils/editUnchangedCompare';

interface ProcedureFormErrors {
  patientId?: string;
  doctorId?: string;
  treatmentId?: string;
}

interface PerformedProcedureFormProps {
  patients: Patient[];
  doctors: Doctor[];
  treatments: Treatment[];
  loading?: boolean;
  mode?: 'create' | 'edit';
  /** En modo edición, valores iniciales (id usado para sincronizar estado) */
  initialProcedure?: PerformedProcedure;
  onSubmit: (data: CreatePerformedProcedureDto) => void;
  onUnchanged?: () => void;
  onCancel?: () => void;
}

/** En edición conserva la hora/zona del registro; solo cambia el día del calendario. */
function buildPerformedAtIso(
  mode: 'create' | 'edit',
  dateInput: string,
  original?: string | Date,
): string {
  if (mode === 'edit' && original != null) {
    const origStr =
      typeof original === 'string' ? original : new Date(original).toISOString();
    const tIdx = origStr.indexOf('T');
    if (tIdx !== -1) {
      return `${dateInput}${origStr.slice(tIdx)}`;
    }
  }
  return `${dateInput}T00:00:00.000Z`;
}

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
  mode = 'create',
  initialProcedure,
  onSubmit,
  onUnchanged,
  onCancel,
}: PerformedProcedureFormProps) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [treatmentId, setTreatmentId] = useState('');
  const [tooth, setTooth] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [performedAt, setPerformedAt] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<ProcedureFormErrors>({});

  useEffect(() => {
    if (mode !== 'edit' || !initialProcedure) return;
    setPatientId(initialProcedure.patientId ?? initialProcedure.patient?.id ?? '');
    setDoctorId(initialProcedure.doctorId ?? initialProcedure.doctor?.id ?? '');
    setTreatmentId(initialProcedure.treatmentId ?? initialProcedure.treatment?.id ?? '');
    setTooth(initialProcedure.tooth ?? '');
    setDescription(initialProcedure.description ?? '');
    setNotes(initialProcedure.notes ?? '');
    setPerformedAt(
      typeof initialProcedure.performedAt === 'string'
        ? initialProcedure.performedAt.slice(0, 10)
        : new Date(initialProcedure.performedAt).toISOString().slice(0, 10),
    );
    setErrors({});
  }, [mode, initialProcedure?.id]);

  const patientOptions = useMemo(() => patients
    .map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })), [patients]);

  const doctorOptions = useMemo(() => doctors
    .map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` })), [doctors]);

  const treatmentOptions = useMemo(() => {
    const active = treatments
      .filter((t) => t.isActive)
      .map((t) => ({ value: t.id, label: `${t.name} — ${t.category}` }));
    if (mode === 'edit' && initialProcedure) {
      const tid = initialProcedure.treatmentId ?? initialProcedure.treatment?.id;
      if (tid && !active.some((o) => o.value === tid)) {
        const cur = treatments.find((t) => t.id === tid);
        if (cur && !cur.isActive) {
          return [{ value: cur.id, label: `${cur.name} — ${cur.category} (inactivo)` }, ...active];
        }
        if (initialProcedure.treatment?.id === tid) {
          const tr = initialProcedure.treatment;
          return [{ value: tr.id, label: `${tr.name} — ${tr.category} (no en catálogo activo)` }, ...active];
        }
      }
    }
    return active;
  }, [treatments, mode, initialProcedure]);

  const handlePatientChange = (id: string) => {
    setPatientId(id);
    setErrors((p) => ({ ...p, patientId: undefined }));
  };

  const validateStep1 = useCallback(() => {
    const stepErrors: ProcedureFormErrors = {};
    if (!patientId) stepErrors.patientId = 'Debe seleccionar un paciente';
    if (!doctorId) stepErrors.doctorId = 'Debe seleccionar un doctor';
    if (!treatmentId) stepErrors.treatmentId = 'Debe seleccionar un tratamiento';
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [patientId, doctorId, treatmentId]);

  const handleSubmit: FormEventHandler = () => {
    const performedAtIso = buildPerformedAtIso(mode, performedAt, initialProcedure?.performedAt);
    const payload: CreatePerformedProcedureDto = {
      patientId,
      doctorId,
      treatmentId,
      performedAt: performedAtIso,
    };
    if (mode === 'edit') {
      payload.tooth = tooth.trim() ? tooth.trim() : null;
      payload.description = description.trim() ? description.trim() : null;
      payload.notes = notes.trim() ? notes.trim() : null;
    } else {
      payload.tooth = tooth.trim() || undefined;
      payload.description = description.trim() || undefined;
      payload.notes = notes.trim() || undefined;
    }
    if (mode === 'edit' && initialProcedure && performedProcedureEditUnchanged(initialProcedure, payload)) {
      onUnchanged?.();
      return;
    }
    onSubmit(payload);
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
        <FormSection
          title="Datos del Procedimiento"
          icon={<IconProcedure />}
          description="Paciente, doctor, tratamiento y fecha. En planes de tratamiento, el conteo usa el mismo paciente y el tratamiento elegido (cuando coincide con ítems del plan)."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Paciente *"
              options={patientOptions}
              value={patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              placeholder="Seleccionar..."
              error={errors.patientId}
            />
            <Select
              label="Doctor *"
              options={doctorOptions}
              value={doctorId}
              onChange={(e) => { setDoctorId(e.target.value); setErrors((p) => ({ ...p, doctorId: undefined })); }}
              placeholder="Seleccionar..."
              error={errors.doctorId}
            />
            <Select
              label="Tratamiento *"
              options={treatmentOptions}
              value={treatmentId}
              onChange={(e) => {
                setTreatmentId(e.target.value);
                setErrors((p) => ({ ...p, treatmentId: undefined }));
              }}
              placeholder="Seleccionar..."
              error={errors.treatmentId}
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
              className="sm:col-span-2"
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
      submitLabel={mode === 'edit' ? 'Guardar cambios' : 'Registrar'}
      loading={loading}
      onCancel={onCancel}
      onStepChange={() => setErrors({})}
      fillParent
    />
  );
};

export default PerformedProcedureForm;
