import { useState, type FormEvent } from 'react';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import { validateDoctor } from '../validations/doctor.validations';
import type { CreateDoctorDto, DoctorFormErrors, Doctor } from '../types/doctor.types';

interface DoctorFormProps {
  initialData?: Doctor;
  onSubmit: (data: CreateDoctorDto) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function DoctorForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
}: DoctorFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [specialty, setSpecialty] = useState(initialData?.specialty || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || '');
  const [errors, setErrors] = useState<DoctorFormErrors>({});

  const clearError = (field: keyof DoctorFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: CreateDoctorDto = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      specialty: specialty.trim(),
      phone: phone.trim(),
      email: email.trim(),
      licenseNumber: licenseNumber.trim(),
    };

    const validationErrors = validateDoctor(data);
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
          Datos Personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            placeholder="Juan"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
            error={errors.firstName}
            autoFocus
          />
          <Input
            label="Apellido *"
            placeholder="Rodríguez"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
            error={errors.lastName}
          />
          <Input
            label="Especialidad *"
            placeholder="Odontología General"
            value={specialty}
            onChange={(e) => { setSpecialty(e.target.value); clearError('specialty'); }}
            error={errors.specialty}
          />
          <Input
            label="Número de licencia *"
            placeholder="LIC-12345"
            value={licenseNumber}
            onChange={(e) => { setLicenseNumber(e.target.value); clearError('licenseNumber'); }}
            error={errors.licenseNumber}
          />
        </div>
      </div>

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
            label="Correo electrónico *"
            type="email"
            placeholder="doctor@ejemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            error={errors.email}
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
