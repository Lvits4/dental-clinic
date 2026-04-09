import { useState, useCallback, useRef, type FormEventHandler, type ReactNode } from 'react';
import {
  TimePicker,
  Select,
  Textarea,
  DatePicker,
  FormSection,
  MultiStepForm,
} from '../ui';
import type { MultiStepFormHandle, Step } from '../ui';
import type {
  CreateAppointmentDto,
  AppointmentFormErrors,
  Patient,
  Doctor,
} from '../../types';
import { DURATION_OPTIONS } from '../../types';
import {
  appointmentEditUnchanged,
  type AppointmentEditInitialValues,
} from '../../utils/editUnchangedCompare';

function validateAppointment(data: CreateAppointmentDto): AppointmentFormErrors {
  const errors: AppointmentFormErrors = {};

  if (!data.patientId) {
    errors.patientId = 'Debe seleccionar un paciente';
  }

  if (!data.doctorId) {
    errors.doctorId = 'Debe seleccionar un doctor';
  }

  if (!data.dateTime) {
    errors.dateTime = 'La fecha y hora son obligatorias';
  } else {
    const date = new Date(data.dateTime);
    if (isNaN(date.getTime())) {
      errors.dateTime = 'Fecha inválida';
    }
  }

  if (data.durationMinutes !== undefined && data.durationMinutes < 15) {
    errors.durationMinutes = 'La duración mínima es 15 minutos';
  }

  return errors;
}

const APPOINTMENT_FIELD_ORDER: (keyof AppointmentFormErrors)[] = [
  'patientId',
  'doctorId',
  'dateTime',
  'durationMinutes',
];

interface AppointmentFormProps {
  patients: Patient[];
  doctors: Doctor[];
  onSubmit: (data: CreateAppointmentDto) => void;
  loading?: boolean;
  submitLabel?: string;
  defaultPatientId?: string;
  defaultDoctorId?: string;
  initialValues?: {
    patientId?: string;
    doctorId?: string;
    date?: string;   // YYYY-MM-DD
    time?: string;   // HH:MM
    durationMinutes?: number;
    reason?: string;
    notes?: string;
  };
  /** Contenido extra que aparece antes del botón Guardar/Siguiente (e.g. sección de estado) */
  footerContent?: ReactNode;
  /** Si el envío no cambió respecto a la cita cargada (edición). */
  onUnchanged?: () => void;
  onCancel?: () => void;
  /** true en modal con altura acotada: el scroll queda solo en el bloque del paso; botones fijos abajo */
  fillParent?: boolean;
}

/* ── Iconos de sección ── */
const IconCalendar = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconNotes = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AppointmentForm = ({
  patients,
  doctors,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
  defaultPatientId = '',
  defaultDoctorId = '',
  initialValues = {},
  footerContent,
  onUnchanged,
  onCancel,
  fillParent = false,
}: AppointmentFormProps) => {
  const [patientId, setPatientId] = useState(initialValues.patientId ?? defaultPatientId);
  const [doctorId, setDoctorId] = useState(initialValues.doctorId ?? defaultDoctorId);
  const [date, setDate] = useState(initialValues.date ?? '');
  const [time, setTime] = useState(initialValues.time ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    initialValues.durationMinutes ? String(initialValues.durationMinutes) : '30'
  );
  const [reason, setReason] = useState(initialValues.reason ?? '');
  const [notes, setNotes] = useState(initialValues.notes ?? '');
  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const multiStepRef = useRef<MultiStepFormHandle>(null);
  const skipClearErrorsOnNextStepChange = useRef(false);

  const clearError = (field: keyof AppointmentFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`,
  }));

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName} — ${d.specialty}`,
  }));

  const validateStep1 = useCallback(() => {
    const stepErrors: AppointmentFormErrors = {};
    if (!patientId) stepErrors.patientId = 'Debe seleccionar un paciente';
    if (!doctorId) stepErrors.doctorId = 'Debe seleccionar un doctor';
    if (!date) {
      stepErrors.dateTime = 'La fecha es obligatoria';
    } else if (!time) {
      stepErrors.dateTime = 'La hora es obligatoria';
    } else {
      const combined = `${date}T${time}:00`;
      const parsed = new Date(combined);
      if (Number.isNaN(parsed.getTime())) {
        stepErrors.dateTime = 'Fecha inválida';
      }
    }
    const dur = Number(durationMinutes);
    if (!Number.isFinite(dur) || dur < 15) {
      stepErrors.durationMinutes = 'La duración mínima es 15 minutos';
    }

    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }, [patientId, doctorId, date, time, durationMinutes]);

  const handleSubmit: FormEventHandler = () => {
    const dateTime = date && time ? `${date}T${time}:00` : '';

    const data: CreateAppointmentDto = {
      patientId,
      doctorId,
      dateTime,
      durationMinutes: Number(durationMinutes),
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const validationErrors = validateAppointment(data);
    const firstErrorKey = APPOINTMENT_FIELD_ORDER.find((k) => validationErrors[k]);
    if (firstErrorKey) {
      setErrors(validationErrors);
      skipClearErrorsOnNextStepChange.current = true;
      multiStepRef.current?.goToStep(0);
      return;
    }

    const { patientId: ivP, doctorId: ivD, date: ivDate, time: ivTime } = initialValues;
    if (ivP && ivD && ivDate && ivTime && onUnchanged) {
      const baseline: AppointmentEditInitialValues = {
        patientId: ivP,
        doctorId: ivD,
        date: ivDate,
        time: ivTime,
        durationMinutes: initialValues.durationMinutes,
        reason: initialValues.reason,
        notes: initialValues.notes,
      };
      if (appointmentEditUnchanged(baseline, data)) {
        onUnchanged();
        return;
      }
    }

    onSubmit(data);
  };

  const steps: Step[] = [
    {
      title: 'Datos de la Cita',
      validate: validateStep1,
      content: (
        <FormSection title="Información de la Cita" icon={<IconCalendar />} description="Paciente, doctor, fecha y duración">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Paciente *"
              options={patientOptions}
              value={patientId}
              onChange={(e) => { setPatientId(e.target.value); clearError('patientId'); }}
              error={errors.patientId}
              placeholder="Seleccionar paciente..."
            />
            <Select
              label="Doctor *"
              options={doctorOptions}
              value={doctorId}
              onChange={(e) => { setDoctorId(e.target.value); clearError('doctorId'); }}
              error={errors.doctorId}
              placeholder="Seleccionar doctor..."
            />
            <DatePicker
              label="Fecha *"
              value={date}
              onChange={(e) => { setDate(e.target.value); clearError('dateTime'); }}
              error={errors.dateTime}
              min={new Date().toISOString().split('T')[0]}
            />
            <TimePicker
              label="Hora *"
              value={time}
              onChange={(e) => { setTime(e.target.value); clearError('dateTime'); }}
              error={undefined}
              placeholder="Seleccionar hora..."
            />
            <Select
              label="Duración"
              options={DURATION_OPTIONS}
              value={durationMinutes}
              onChange={(e) => {
                setDurationMinutes(e.target.value);
                clearError('durationMinutes');
              }}
              error={errors.durationMinutes}
            />
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Detalles',
      content: (
        <FormSection title="Detalles" icon={<IconNotes />} description="Motivo de consulta y notas adicionales">
          <div className="space-y-4">
            <Textarea
              label="Motivo de la cita"
              placeholder="Consulta general, limpieza, dolor..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <Textarea
              label="Notas"
              placeholder="Notas adicionales..."
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
      ref={multiStepRef}
      steps={steps}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      loading={loading}
      beforeButtons={footerContent}
      onCancel={onCancel}
      onStepChange={() => {
        if (skipClearErrorsOnNextStepChange.current) {
          skipClearErrorsOnNextStepChange.current = false;
          return;
        }
        setErrors({});
      }}
      fillParent={fillParent}
      stepBodyClassName={fillParent ? '' : 'min-h-[min(22rem,48dvh)]'}
    />
  );
};

export default AppointmentForm;
