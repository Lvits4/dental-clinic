import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCreateClinicalEvolution } from '../hooks/useClinicalEvolutions';
import { useClinicalRecord } from '../../clinical-records/hooks/useClinicalRecord';
import { useDoctorsList } from '../../doctors/hooks/useDoctorsList';
import Input from '../../../shared/components/ui/Input';
import Select from '../../../shared/components/ui/Select';
import Textarea from '../../../shared/components/ui/Textarea';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/feedback/Spinner';

export default function ClinicalEvolutionCreateView() {
  const { id: patientId } = useParams<{ id: string }>();
  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId!);
  const { data: doctors, isLoading: loadingDoctors } = useDoctorsList();
  const createMutation = useCreateClinicalEvolution(patientId!);

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [consultationReason, setConsultationReason] = useState('');
  const [findings, setFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [procedurePerformed, setProcedurePerformed] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [observations, setObservations] = useState('');

  if (loadingRecord || loadingDoctors) return <div className="flex justify-center py-12"><Spinner /></div>;

  const doctorOptions = (doctors || []).filter((d) => d.isActive).map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName}`,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!record) return;

    createMutation.mutate({
      clinicalRecordId: record.id,
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to={`/patients/${patientId}/evolutions`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Evolución</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Doctor *" options={doctorOptions} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Seleccionar doctor..." />
          <Input label="Fecha *" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <Textarea label="Motivo de consulta *" value={consultationReason} onChange={(e) => setConsultationReason(e.target.value)} rows={2} />
        <Textarea label="Hallazgos *" value={findings} onChange={(e) => setFindings(e.target.value)} rows={2} />
        <Textarea label="Diagnóstico *" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={2} />
        <Textarea label="Procedimiento realizado *" value={procedurePerformed} onChange={(e) => setProcedurePerformed(e.target.value)} rows={2} />
        <Textarea label="Recomendaciones" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} rows={2} />
        <Textarea label="Observaciones" value={observations} onChange={(e) => setObservations(e.target.value)} rows={2} />
        <div className="flex justify-end gap-3">
          <Button type="submit" loading={createMutation.isPending}>Registrar Evolución</Button>
        </div>
      </form>
    </div>
  );
}
