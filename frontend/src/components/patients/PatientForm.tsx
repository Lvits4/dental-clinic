import { useState, type FormEvent } from 'react';
import { Input, Select, Textarea, Button } from '../ui';
import type { CreatePatientDto, PatientFormErrors, Patient } from '../../types';
import { SEX_OPTIONS } from '../../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()-]{7,20}$/;

function validatePatient(data: CreatePatientDto): PatientFormErrors {
  const errors: PatientFormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'El apellido debe tener al menos 2 caracteres';
  }

  if (!data.sex) {
    errors.sex = 'El sexo es obligatorio';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'La fecha de nacimiento es obligatoria';
  } else {
    const date = new Date(data.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = 'Fecha invalida';
    } else if (date > new Date()) {
      errors.dateOfBirth = 'La fecha no puede ser futura';
    }
  }

  if (!data.phone.trim()) {
    errors.phone = 'El telefono es obligatorio';
  } else if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = 'Formato de telefono invalido';
  }

  if (data.email && data.email.trim() && !EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Formato de correo invalido';
  }

  return errors;
}

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (data: CreatePatientDto) => void;
  loading?: boolean;
  submitLabel?: string;
}

const PatientForm = ({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
}: PatientFormProps) => {
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
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
          Datos Personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            placeholder="Maria"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
            error={errors.firstName}
            autoFocus
          />
          <Input
            label="Apellido *"
            placeholder="Garcia"
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
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
          Contacto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Telefono *"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
            error={errors.phone}
          />
          <Input
            label="Correo electronico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            error={errors.email}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Direccion"
            placeholder="Calle, ciudad, codigo postal..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Informacion medica */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
          Informacion Medica
        </h3>
        <div className="space-y-4">
          <Textarea
            label="Antecedentes medicos"
            placeholder="Enfermedades previas, cirugias, etc."
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
};

export default PatientForm;
