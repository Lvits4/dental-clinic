import type {
  ClinicalRecord,
  CreateAppointmentDto,
  CreateDoctorDto,
  CreatePatientDto,
  CreatePerformedProcedureDto,
  CreateTreatmentDto,
  Doctor,
  Patient,
  PerformedProcedure,
  Treatment,
  UpdateClinicalRecordDto,
  User,
} from '../types';
import type { UpdateUserDto } from '../requests/users.api';

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

/** Valores iniciales de cita para comparar con el envío (misma construcción que AppointmentForm). */
export type AppointmentEditInitialValues = {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  durationMinutes?: number;
  reason?: string;
  notes?: string;
};

/** true si el usuario intenta actualizar contraseña (cualquier valor nuevo cuenta como cambio). */
export function userEditUnchanged(user: User, submitted: UpdateUserDto): boolean {
  if (submitted.password != null && submitted.password.length > 0) return false;
  const fullName = submitted.fullName?.trim() ?? '';
  const username = submitted.username?.trim() ?? '';
  const email = submitted.email?.trim() ?? '';
  const role = submitted.role;
  return (
    user.fullName.trim() === fullName &&
    user.username.trim() === username &&
    user.email.trim() === email &&
    user.role === role
  );
}

function treatmentDefaultPriceAsSubmitted(t: Treatment): number | undefined {
  const s = t.defaultPrice.toString().trim();
  return s ? Number(s) : undefined;
}

/** true si el payload coincide con el tratamiento cargado (edición). */
export function treatmentEditUnchanged(treatment: Treatment, submitted: CreateTreatmentDto): boolean {
  return (
    treatment.name.trim() === submitted.name.trim() &&
    optTrim(treatment.description) === optTrim(submitted.description) &&
    treatment.category.trim() === submitted.category.trim() &&
    treatmentDefaultPriceAsSubmitted(treatment) === submitted.defaultPrice
  );
}

/** true si la cita enviada coincide con los valores iniciales del formulario de edición. */
export function appointmentEditUnchanged(
  initial: AppointmentEditInitialValues,
  submitted: CreateAppointmentDto,
): boolean {
  const expectedDateTime = `${initial.date}T${initial.time}:00`;
  const initialDuration =
    initial.durationMinutes !== undefined && initial.durationMinutes !== null
      ? Number(initial.durationMinutes)
      : 30;
  const dur = submitted.durationMinutes ?? 30;
  const durationMatch = dur === initialDuration;
  return (
    submitted.patientId === initial.patientId &&
    submitted.doctorId === initial.doctorId &&
    submitted.dateTime === expectedDateTime &&
    durationMatch &&
    optTrim(initial.reason) === optTrim(submitted.reason) &&
    optTrim(initial.notes) === optTrim(submitted.notes)
  );
}

function performedProcedureDay(iso: string | Date | undefined): string {
  if (iso == null) return '';
  if (iso instanceof Date) return iso.toISOString().slice(0, 10);
  if (typeof iso === 'string' && iso.length >= 10) return iso.slice(0, 10);
  return '';
}

function normalizeProcedurePlanLink(proc: PerformedProcedure): {
  itemId: string | null;
  planId: string | null;
} {
  const item = proc.treatmentPlanItemId ?? null;
  const plan = proc.treatmentPlanId ?? null;
  return { itemId: item, planId: item ? null : plan };
}

function normalizeSubmittedPlanLink(submitted: CreatePerformedProcedureDto): {
  itemId: string | null;
  planId: string | null;
} {
  const item = submitted.treatmentPlanItemId ?? null;
  const plan = submitted.treatmentPlanId ?? null;
  if (item) return { itemId: item, planId: null };
  if (plan) return { itemId: null, planId: plan };
  return { itemId: null, planId: null };
}

/** true si el procedimiento enviado coincide con el registro cargado (fecha por día calendario). */
export function performedProcedureEditUnchanged(
  proc: PerformedProcedure,
  submitted: CreatePerformedProcedureDto,
): boolean {
  const procPatient = proc.patientId ?? proc.patient?.id ?? '';
  const procDoctor = proc.doctorId ?? proc.doctor?.id ?? '';
  const procTreatment = proc.treatmentId ?? proc.treatment?.id ?? '';
  const procDay = performedProcedureDay(proc.performedAt);
  const subDay = performedProcedureDay(submitted.performedAt);
  const procLink = normalizeProcedurePlanLink(proc);
  const subLink = normalizeSubmittedPlanLink(submitted);
  return (
    procPatient === submitted.patientId &&
    procDoctor === submitted.doctorId &&
    procTreatment === submitted.treatmentId &&
    procDay === subDay &&
    optTrim(proc.tooth) === optTrim(submitted.tooth) &&
    optTrim(proc.description) === optTrim(submitted.description) &&
    optTrim(proc.notes) === optTrim(submitted.notes) &&
    procLink.itemId === subLink.itemId &&
    procLink.planId === subLink.planId
  );
}

/** true si las observaciones del plan no cambiaron (PATCH de edición solo envía este campo). */
export function treatmentPlanObservationsUnchanged(
  initial: string | null | undefined,
  submitted: string | undefined,
): boolean {
  return optTrim(initial) === optTrim(submitted);
}
