import { useState, type FormEvent } from 'react';
import { Select, Textarea, Button } from '../ui';
import type { CreateTreatmentPlanDto, Patient, Doctor } from '../../types';

interface TreatmentPlanFormErrors {
  patientId?: string;
  doctorId?: string;
}

function validatePlan(data: CreateTreatmentPlanDto): TreatmentPlanFormErrors {
  const errors: TreatmentPlanFormErrors = {};
  if (!data.patientId) errors.patientId = 'Debe seleccionar un paciente';
  if (!data.doctorId) errors.doctorId = 'Debe seleccionar un doctor';
  return errors;
}

interface TreatmentPlanFormProps {
  patients: Patient[];
  doctors: Doctor[];
  onSubmit: (data: CreateTreatmentPlanDto) => void;
  loading?: boolean;
  submitLabel?: string;
}

const TreatmentPlanForm = ({
  patients,
  doctors,
  onSubmit,
  loading = false,
  submitLabel = 'Crear Plan',
}: TreatmentPlanFormProps) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [observations, setObservations] = useState('');
  const [errors, setErrors] = useState<TreatmentPlanFormErrors>({});

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: CreateTreatmentPlanDto = {
      patientId,
      doctorId,
      observations: observations.trim() || undefined,
    };
    const validationErrors = validatePlan(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Textarea
        label="Observaciones"
        placeholder="Observaciones generales del plan..."
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default TreatmentPlanForm;
