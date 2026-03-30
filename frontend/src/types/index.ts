// Tipos comunes / compartidos
export type {
  ApiResponse,
  PaginationMeta,
  PaginatedResponse,
  PaginationParams,
  SelectOption,
  ApiError,
} from './common.types';

// Entidades de dominio
export type {
  User,
  UserSortBy,
  UserSortOrder,
} from './user.types';

export type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  LoginFormErrors,
  RegisterFormErrors,
  UpdateAccountDto,
  UpdateAccountResponse,
} from './auth.types';

export type {
  PatientSex,
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  PatientFilters,
  PatientFormErrors,
  PatientSortBy,
  PatientSortOrder,
} from './patient.types';
export { SEX_OPTIONS } from './patient.types';

export type {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorFilters,
  DoctorFormErrors,
  DoctorSortBy,
  DoctorSortOrder,
} from './doctor.types';

export type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  UpdateStatusDto,
  RescheduleAppointmentDto,
  AppointmentFilters,
  AppointmentFormErrors,
  AppointmentSortBy,
  AppointmentSortOrder,
} from './appointment.types';
export {
  STATUS_CONFIG,
  STATUS_OPTIONS,
  DURATION_OPTIONS,
  VALID_STATUS_TRANSITIONS,
  appointmentAllowsStatusChange,
} from './appointment.types';

export type {
  Treatment,
  CreateTreatmentDto,
  UpdateTreatmentDto,
  TreatmentFormErrors,
  TreatmentFilters,
  TreatmentSortBy,
  TreatmentSortOrder,
} from './treatment.types';
export { TREATMENT_CATEGORIES } from './treatment.types';

export type {
  TreatmentPlanItem,
  TreatmentPlan,
  CreateTreatmentPlanDto,
  TreatmentPlanSortBy,
  TreatmentPlanSortOrder,
} from './treatment-plan.types';
export { PLAN_STATUS_CONFIG, VALID_PLAN_STATUS_TRANSITIONS } from './treatment-plan.types';

export type {
  PerformedProcedure,
  CreatePerformedProcedureDto,
  PerformedProcedureFilters,
} from './performed-procedure.types';

export type {
  ClinicalRecord,
  CreateClinicalRecordDto,
  UpdateClinicalRecordDto,
} from './clinical-record.types';

export type {
  ClinicalEvolution,
  CreateClinicalEvolutionDto,
  ClinicalEvolutionFilters,
} from './clinical-evolution.types';

export type {
  ClinicalFile,
  ClinicalFileFilters,
} from './clinical-file.types';

export type {
  DashboardSummary,
  StatusCount,
  DoctorWorkload,
  RecentActivity,
} from './dashboard.types';
