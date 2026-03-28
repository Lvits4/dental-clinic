import { useState, type FormEvent } from 'react';
import Input from '../../../../common/components/Input/Input';
import Select from '../../../../common/components/Select/Select';
import Textarea from '../../../../common/components/Textarea/Textarea';
import Button from '../../../../common/components/Button/Button';
import { validateAppointment } from '../../validations/appointment.validations';
import type { CreateAppointmentDto, AppointmentFormErrors } from '../../types/appointment.types';
import { DURATION_OPTIONS } from '../../types/appointment.types';
import type { Patient } from '../../../patients/types/patient.types';
import type { Doctor } from '../../../doctors/types/doctor.types';

interface AppointmentFormProps {
  patients: Patient[];
  doctors: Doctor[];
  onSubmit: (data: CreateAppointmentDto) => void;
  loading?: boolean;
  submitLabel?: string;
  defaultPatientId?: string;
  defaultDoctorId?: string;
}

const AppointmentForm = ({
  patients,
  doctors,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
  defaultPatientId = '',
  defaultDoctorId = '',
}: AppointmentFormProps) => {
  const [patientId, setPatientId] = useState(defaultPatientId);
  const [doctorId, setDoctorId] = useState(defaultDoctorId);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<AppointmentFormErrors>({});

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Información de la Cita
        </h3>
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
          <Input
            label="Fecha *"
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); clearError('dateTime'); }}
            error={errors.dateTime}
            min={new Date().toISOString().split('T')[0]}
          />
          <Input
            label="Hora *"
            type="time"
            value={time}
            onChange={(e) => { setTime(e.target.value); clearError('dateTime'); }}
          />
          <Select
            label="Duración"
            options={DURATION_OPTIONS}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            error={errors.durationMinutes}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Detalles
        </h3>
        <div className="space-y-4">
          <Textarea
            label="Motivo de la cita"
            placeholder="Consulta general, limpieza, dolor..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />
          <Textarea
            label="Notas"
            placeholder="Notas adicionales..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;

