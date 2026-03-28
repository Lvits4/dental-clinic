import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCreatePerformedProcedure } from '../hooks/usePerformedProcedures';
import { usePatientsList } from '../../patients/hooks/usePatientsList';
import { useDoctorsList } from '../../doctors/hooks/useDoctorsList';
import { useTreatmentsList } from '../../treatments/hooks/useTreatmentsList';
import Select from '../../../common/components/Select/Select';
import Input from '../../../common/components/Input/Input';
import Textarea from '../../../common/components/Textarea/Textarea';
import Button from '../../../common/components/Button/Button';
import Spinner from '../../../common/components/Spinner/Spinner';

const PerformedProcedureCreateView = () => {
  const createMutation = useCreatePerformedProcedure();
  const { data: patientsData, isLoading: lp } = usePatientsList({ limit: 500 });
  const { data: doctors, isLoading: ld } = useDoctorsList();
  const { data: treatments, isLoading: lt } = useTreatmentsList();

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [treatmentId, setTreatmentId] = useState('');
  const [tooth, setTooth] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [performedAt, setPerformedAt] = useState(new Date().toISOString().split('T')[0]);

  if (lp || ld || lt) return <div className="flex justify-center py-12"><Spinner /></div>;

  const patientOptions = (patientsData?.data || []).filter((p) => p.isActive).map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));
  const doctorOptions = (doctors || []).filter((d) => d.isActive).map((d) => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }));
  const treatmentOptions = (treatments || []).filter((t) => t.isActive).map((t) => ({ value: t.id, label: `${t.name} — ${t.category}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      patientId,
      doctorId,
      treatmentId,
      tooth: tooth.trim() || undefined,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      performedAt: `${performedAt}T00:00:00`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/performed-procedures" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Procedimiento</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Paciente *" options={patientOptions} value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Seleccionar..." />
          <Select label="Doctor *" options={doctorOptions} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Seleccionar..." />
          <Select label="Tratamiento *" options={treatmentOptions} value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)} placeholder="Seleccionar..." />
          <Input label="Fecha *" type="date" value={performedAt} onChange={(e) => setPerformedAt(e.target.value)} />
          <Input label="Pieza dental" placeholder="Ej: 18, 21" value={tooth} onChange={(e) => setTooth(e.target.value)} />
        </div>
        <Textarea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        <Textarea label="Notas" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        <div className="flex justify-end">
          <Button type="submit" loading={createMutation.isPending}>Registrar</Button>
        </div>
      </form>
    </div>
  );
};

export default PerformedProcedureCreateView;
