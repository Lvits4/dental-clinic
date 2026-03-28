import { useState, type FormEvent } from 'react';
import { Input, Select, Textarea, Button, Spinner } from '../ui';
import type { CreatePerformedProcedureDto, Patient, Doctor, Treatment } from '../../types';

interface PerformedProcedureFormProps {
  patients: Patient[];
  doctors: Doctor[];
  treatments: Treatment[];
  loading?: boolean;
  onSubmit: (data: CreatePerformedProcedureDto) => void;
}

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

  const patientOptions = patients
    .filter((p) => p.isActive)
    .map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));

  const doctorOptions = doctors
    .filter((d) => d.isActive)
    .map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }));

  const treatmentOptions = treatments
    .filter((t) => t.isActive)
    .map((t) => ({ value: t.id, label: `${t.name} — ${t.category}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Input
          label="Fecha *"
          type="date"
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
      <Textarea
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Notas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          Registrar
        </Button>
      </div>
    </form>
  );
};

export default PerformedProcedureForm;
