import { useState, type FormEvent } from 'react';
import Input from '../../../shared/components/ui/Input';
import Select from '../../../shared/components/ui/Select';
import Textarea from '../../../shared/components/ui/Textarea';
import Button from '../../../shared/components/ui/Button';
import { validatePatient } from '../validations/patient.validations';
import type { CreatePatientDto, PatientFormErrors, Patient } from '../types/patient.types';
import { SEX_OPTIONS } from '../types/patient.types';

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (data: CreatePatientDto) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function PatientForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
}: PatientFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [sex, setSex] = useState(initialData?.sex || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth?.split('T')[0] || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [medicalHistory, setMedicalHistory] = useState(initialData?.medicalHistory || '');
  const [allergies, setAllergies] = useState(initialData?.allergies || '');
  const [medications, setMedications] = useState(initialData?.medications || '');
  const [observations, setObservations] = useState(initialData?.observations || '');
  const [errors, setErrors] = useState<PatientFormErrors>({});

  const clearError = (field: keyof PatientFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: CreatePatientDto = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      sex: sex as CreatePatientDto['sex'],
      dateOfBirth,
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      medicalHistory: medicalHistory.trim() || undefined,
      allergies: allergies.trim() || undefined,
      medications: medications.trim() || undefined,
      observations: observations.trim() || undefined,
    };

    const validationErrors = validatePatient(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos personales */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Datos Personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            placeholder="María"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
            error={errors.firstName}
            autoFocus
          />
          <Input
            label="Apellido *"
            placeholder="García"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
            error={errors.lastName}
          />
          <Select
            label="Sexo *"
            options={SEX_OPTIONS}
            value={sex}
            onChange={(e) => { setSex(e.target.value); clearError('sex'); }}
            error={errors.sex}
          />
          <Input
            label="Fecha de nacimiento *"
            type="date"
            value={dateOfBirth}
            onChange={(e) => { setDateOfBirth(e.target.value); clearError('dateOfBirth'); }}
            error={errors.dateOfBirth}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Contacto */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Contacto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Teléfono *"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
            error={errors.phone}
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            error={errors.email}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Dirección"
            placeholder="Calle, ciudad, código postal..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Historial médico */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Información Médica
        </h3>
        <div className="space-y-4">
          <Textarea
            label="Antecedentes médicos"
            placeholder="Enfermedades previas, cirugías, etc."
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Alergias"
              placeholder="Alergias conocidas..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={2}
            />
            <Textarea
              label="Medicamentos"
              placeholder="Medicamentos actuales..."
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              rows={2}
            />
          </div>
          <Textarea
            label="Observaciones"
            placeholder="Notas adicionales..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
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
}
