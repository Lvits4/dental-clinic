import type {
  ClinicalRecord,
  CreateDoctorDto,
  CreatePatientDto,
  Doctor,
  Patient,
  UpdateClinicalRecordDto,
} from '../types';

function optTrim(v?: string | null): string | undefined {
  const t = (v ?? '').trim();
  return t || undefined;
}

/** true si el payload del formulario coincide con el paciente cargado (edición). */
export function patientEditUnchanged(patient: Patient, submitted: CreatePatientDto): boolean {
  const snap: CreatePatientDto = {
    firstName: patient.firstName.trim(),
    lastName: patient.lastName.trim(),
    sex: patient.sex,
    dateOfBirth: patient.dateOfBirth.split('T')[0],
    phone: patient.phone.trim(),
    email: optTrim(patient.email),
    address: optTrim(patient.address),
    medicalHistory: optTrim(patient.medicalHistory),
    allergies: optTrim(patient.allergies),
    medications: optTrim(patient.medications),
    observations: optTrim(patient.observations),
  };
  return (
    snap.firstName === submitted.firstName &&
    snap.lastName === submitted.lastName &&
    snap.sex === submitted.sex &&
    snap.dateOfBirth === submitted.dateOfBirth &&
    snap.phone === submitted.phone &&
    snap.email === submitted.email &&
    snap.address === submitted.address &&
    snap.medicalHistory === submitted.medicalHistory &&
    snap.allergies === submitted.allergies &&
    snap.medications === submitted.medications &&
    snap.observations === submitted.observations
  );
}

/** true si el payload coincide con el doctor cargado (edición). */
export function doctorEditUnchanged(doctor: Doctor, submitted: CreateDoctorDto): boolean {
  return (
    doctor.firstName.trim() === submitted.firstName &&
    doctor.lastName.trim() === submitted.lastName &&
    doctor.specialty.trim() === submitted.specialty &&
    doctor.phone.trim() === submitted.phone &&
    doctor.email.trim() === submitted.email &&
    doctor.licenseNumber.trim() === submitted.licenseNumber
  );
}

/** true si el payload coincide con el expediente cargado (edición). */
export function clinicalRecordEditUnchanged(
  record: ClinicalRecord,
  submitted: UpdateClinicalRecordDto,
): boolean {
  const snap: UpdateClinicalRecordDto = {
    medicalBackground: optTrim(record.medicalBackground),
    dentalBackground: optTrim(record.dentalBackground),
    consultationReason: optTrim(record.consultationReason),
    diagnosis: optTrim(record.diagnosis),
    observations: optTrim(record.observations),
  };
  const keys: (keyof UpdateClinicalRecordDto)[] = [
    'medicalBackground',
    'dentalBackground',
    'consultationReason',
    'diagnosis',
    'observations',
  ];
  return keys.every((k) => snap[k] === submitted[k]);
}
