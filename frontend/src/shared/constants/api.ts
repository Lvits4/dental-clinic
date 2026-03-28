export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',

  // Patients
  PATIENTS: '/patients',

  // Doctors
  DOCTORS: '/doctors',

  // Appointments
  APPOINTMENTS: '/appointments',

  // Clinical Records
  CLINICAL_RECORDS: '/clinical-records',

  // Clinical Evolutions
  CLINICAL_EVOLUTIONS: '/clinical-evolutions',

  // Treatments
  TREATMENTS: '/treatments',

  // Treatment Plans
  TREATMENT_PLANS: '/treatment-plans',

  // Performed Procedures
  PERFORMED_PROCEDURES: '/performed-procedures',

  // Clinical Files
  CLINICAL_FILES: '/clinical-files',

  // Dashboard
  DASHBOARD: '/dashboard',
} as const;
