import { useState, type FormEvent } from 'react';
import { Input, Select, Textarea, Button, DatePicker } from '../ui';
import type { CreateClinicalEvolutionDto, Doctor } from '../../types';

interface ClinicalEvolutionFormProps {
  clinicalRecordId: string;
  doctors: Doctor[];
  loading?: boolean;
  onSubmit: (data: CreateClinicalEvolutionDto) => void;
}

const ClinicalEvolutionForm = ({
  clinicalRecordId,
  doctors,
  loading = false,
  onSubmit,
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Textarea
        label="Motivo de consulta *"
        value={consultationReason}
        onChange={(e) => setConsultationReason(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Hallazgos *"
        value={findings}
        onChange={(e) => setFindings(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Diagnóstico *"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Procedimiento realizado *"
        value={procedurePerformed}
        onChange={(e) => setProcedurePerformed(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Recomendaciones"
        value={recommendations}
        onChange={(e) => setRecommendations(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Observaciones"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        rows={2}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          Registrar Evolución
        </Button>
      </div>
    </form>
  );
};

export default ClinicalEvolutionForm;
