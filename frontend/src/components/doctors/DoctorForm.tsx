import { useState, useCallback, type FormEvent } from 'react';
import { Input, FormSection, MultiStepForm } from '../ui';
import type { Step } from '../ui';
import type { CreateDoctorDto, Doctor, DoctorFormErrors } from '../../types';
import { doctorEditUnchanged } from '../../utils/editUnchangedCompare';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateDoctor(data: CreateDoctorDto): DoctorFormErrors {
  const errors: DoctorFormErrors = {};

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

  if (!data.specialty.trim()) {
    errors.specialty = 'La especialidad es obligatoria';
  }

  if (!data.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio';
  }

  if (!data.email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Formato de correo inválido';
  }

  if (!data.licenseNumber.trim()) {
    errors.licenseNumber = 'El número de licencia es obligatorio';
  }

  return errors;
}

interface DoctorFormProps {
  initialData?: Doctor;
  onSubmit: (data: CreateDoctorDto) => void;
  onUnchanged?: () => void;
  loading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

/* ── Iconos de sección ── */
const IconUser = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconPhone = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const DoctorForm = ({
  initialData,
  onSubmit,
  onUnchanged,
  loading = false,
  submitLabel = 'Guardar',
  onCancel,
}: DoctorFormProps) => {
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

  const validateStep1 = useCallback(() => {
    const stepErrors: DoctorFormErrors = {};
    if (!firstName.trim()) stepErrors.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) stepErrors.lastName = 'El apellido es obligatorio';
    if (!specialty.trim()) stepErrors.specialty = 'La especialidad es obligatoria';
    if (!licenseNumber.trim()) stepErrors.licenseNumber = 'El número de licencia es obligatorio';

    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }, [firstName, lastName, specialty, licenseNumber]);

  const handleSubmit = (_e: FormEvent) => {
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

    if (initialData && doctorEditUnchanged(initialData, data)) {
      onUnchanged?.();
      return;
    }

    onSubmit(data);
  };

  const steps: Step[] = [
    {
      title: 'Datos Personales',
      content: (
        <FormSection title="Datos Personales" icon={<IconUser />} description="Nombre, especialidad y licencia">
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
        </FormSection>
      ),
    },
    {
      title: 'Contacto',
      content: (
        <FormSection title="Contacto" icon={<IconPhone />} description="Teléfono y correo electrónico">
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
        </FormSection>
      ),
    },
  ];

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      loading={loading}
      onCancel={onCancel}
      onStepChange={() => setErrors({})}
    />
  );
};

export default DoctorForm;
