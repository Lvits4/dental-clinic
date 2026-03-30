import { useState, useCallback, useRef, type FormEvent } from 'react';
import { Input, Select, Textarea, DatePicker, FormSection, MultiStepForm } from '../ui';
import type { MultiStepFormHandle, Step } from '../ui';
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

/** Orden para decidir qué error mostrar primero y en qué paso está. */
const PATIENT_FIELD_ORDER: (keyof PatientFormErrors)[] = [
  'firstName',
  'lastName',
  'sex',
  'dateOfBirth',
  'phone',
  'email',
];

function stepIndexForPatientErrorKey(key: keyof PatientFormErrors): number {
  if (['firstName', 'lastName', 'sex', 'dateOfBirth'].includes(key)) return 0;
  if (['phone', 'email'].includes(key)) return 1;
  return 2;
}

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (data: CreatePatientDto) => void;
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
const IconMedical = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const PatientForm = ({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
  onCancel,
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
  const multiStepRef = useRef<MultiStepFormHandle>(null);
  /** Evita que onStepChange borre errores justo después de saltar al paso con fallo de validación. */
  const skipClearErrorsOnNextStepChange = useRef(false);

  const clearError = (field: keyof PatientFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = useCallback(() => {
    const stepErrors: PatientFormErrors = {};
    if (!firstName.trim()) stepErrors.firstName = 'El nombre es obligatorio';
    else if (firstName.trim().length < 2) stepErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    if (!lastName.trim()) stepErrors.lastName = 'El apellido es obligatorio';
    else if (lastName.trim().length < 2) stepErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    if (!sex) stepErrors.sex = 'El sexo es obligatorio';
    if (!dateOfBirth) stepErrors.dateOfBirth = 'La fecha de nacimiento es obligatoria';

    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }, [firstName, lastName, sex, dateOfBirth]);

  const validateStep2 = useCallback(() => {
    const stepErrors: PatientFormErrors = {};
    if (!phone.trim()) stepErrors.phone = 'El telefono es obligatorio';
    else if (!PHONE_REGEX.test(phone.trim())) stepErrors.phone = 'Formato de telefono invalido';
    if (email && email.trim() && !EMAIL_REGEX.test(email.trim())) stepErrors.email = 'Formato de correo invalido';

    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }, [phone, email]);

  const handleSubmit = (_e: FormEvent) => {
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
    const firstErrorKey = PATIENT_FIELD_ORDER.find((k) => validationErrors[k]);
    if (firstErrorKey) {
      setErrors(validationErrors);
      skipClearErrorsOnNextStepChange.current = true;
      multiStepRef.current?.goToStep(stepIndexForPatientErrorKey(firstErrorKey));
      return;
    }

    onSubmit(data);
  };

  const steps: Step[] = [
    {
      title: 'Datos Personales',
      content: (
        <FormSection title="Datos Personales" icon={<IconUser />} description="Información básica del paciente">
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
            <DatePicker
              label="Fecha de nacimiento *"
              value={dateOfBirth}
              onChange={(e) => { setDateOfBirth(e.target.value); clearError('dateOfBirth'); }}
              error={errors.dateOfBirth}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </FormSection>
      ),
    },
    {
      title: 'Contacto',
      content: (
        <FormSection title="Contacto" icon={<IconPhone />} description="Teléfono, correo y dirección">
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
        </FormSection>
      ),
    },
    {
      title: 'Info. Médica',
      content: (
        <FormSection title="Información Médica" icon={<IconMedical />} description="Historial clínico y medicación actual">
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
        </FormSection>
      ),
    },
  ];

  return (
    <MultiStepForm
      ref={multiStepRef}
      steps={steps}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      loading={loading}
      onCancel={onCancel}
      onStepChange={() => {
        if (skipClearErrorsOnNextStepChange.current) {
          skipClearErrorsOnNextStepChange.current = false;
          return;
        }
        setErrors({});
      }}
    />
  );
};

export default PatientForm;
