import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCreateTreatmentPlan } from '../hooks/useTreatmentPlans';
import { usePatientsList } from '../../patients/hooks/usePatientsList';
import { useDoctorsList } from '../../doctors/hooks/useDoctorsList';
import Select from '../../../shared/components/ui/Select';
import Textarea from '../../../shared/components/ui/Textarea';
import Button from '../../../shared/components/ui/Button';
import Spinner from '../../../shared/components/feedback/Spinner';

export default function TreatmentPlanCreateView() {
  const createMutation = useCreateTreatmentPlan();
  const { data: patientsData, isLoading: lp } = usePatientsList({ limit: 500 });
  const { data: doctors, isLoading: ld } = useDoctorsList();

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [observations, setObservations] = useState('');

  if (lp || ld) return <div className="flex justify-center py-12"><Spinner /></div>;

  const patientOptions = (patientsData?.data || []).filter((p) => p.isActive).map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));
  const doctorOptions = (doctors || []).filter((d) => d.isActive).map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      patientId,
      doctorId,
      observations: observations.trim() || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/treatment-plans" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Plan de Tratamiento</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Paciente *" options={patientOptions} value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Seleccionar paciente..." />
          <Select label="Doctor *" options={doctorOptions} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Seleccionar doctor..." />
        </div>
        <Textarea label="Observaciones" value={observations} onChange={(e) => setObservations(e.target.value)} rows={3} />
        <div className="flex justify-end">
          <Button type="submit" loading={createMutation.isPending}>Crear Plan</Button>
        </div>
      </form>
    </div>
  );
}
