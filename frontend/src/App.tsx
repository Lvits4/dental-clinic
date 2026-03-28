import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './common/layouts/MainLayout/MainLayout';
import AuthLayout from './modules/auth/layouts/AuthLayout/AuthLayout';
import ProtectedRoute from './common/components/ProtectedRoute/ProtectedRoute';

// Auth
import LoginView from './modules/auth/views/LoginView';
import RegisterView from './modules/auth/views/RegisterView';

// Dashboard
import DashboardView from './modules/dashboard/views/DashboardView';

// Patients
import PatientsListView from './modules/patients/views/PatientsListView';
import PatientCreateView from './modules/patients/views/PatientCreateView';
import PatientDetailView from './modules/patients/views/PatientDetailView';
import PatientEditView from './modules/patients/views/PatientEditView';

// Doctors
import DoctorsListView from './modules/doctors/views/DoctorsListView';
import DoctorCreateView from './modules/doctors/views/DoctorCreateView';
import DoctorDetailView from './modules/doctors/views/DoctorDetailView';
import DoctorEditView from './modules/doctors/views/DoctorEditView';

// Appointments
import AppointmentsListView from './modules/appointments/views/AppointmentsListView';
import AppointmentCreateView from './modules/appointments/views/AppointmentCreateView';
import AppointmentDetailView from './modules/appointments/views/AppointmentDetailView';
import AppointmentAgendaView from './modules/appointments/views/AppointmentAgendaView';

// Treatments
import TreatmentsListView from './modules/treatments/views/TreatmentsListView';
import TreatmentCreateView from './modules/treatments/views/TreatmentCreateView';
import TreatmentEditView from './modules/treatments/views/TreatmentEditView';

// Treatment Plans
import TreatmentPlansListView from './modules/treatment-plans/views/TreatmentPlansListView';
import TreatmentPlanCreateView from './modules/treatment-plans/views/TreatmentPlanCreateView';
import TreatmentPlanDetailView from './modules/treatment-plans/views/TreatmentPlanDetailView';

// Performed Procedures
import PerformedProceduresListView from './modules/performed-procedures/views/PerformedProceduresListView';
import PerformedProcedureCreateView from './modules/performed-procedures/views/PerformedProcedureCreateView';

// Clinical
import ClinicalRecordView from './modules/clinical-records/views/ClinicalRecordView';
import ClinicalEvolutionsListView from './modules/clinical-evolutions/views/ClinicalEvolutionsListView';
import ClinicalEvolutionCreateView from './modules/clinical-evolutions/views/ClinicalEvolutionCreateView';
import ClinicalFilesListView from './modules/clinical-files/views/ClinicalFilesListView';

const App = () => {
  return (
    <Routes>
      {/* Rutas de autenticación (sin navbar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Route>

      {/* Rutas protegidas (con navbar) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<DashboardView />} />

          {/* Pacientes */}
          <Route path="/patients" element={<PatientsListView />} />
          <Route path="/patients/new" element={<PatientCreateView />} />
          <Route path="/patients/:id" element={<PatientDetailView />} />
          <Route path="/patients/:id/edit" element={<PatientEditView />} />

          {/* Clinical Records (anidados a paciente) */}
          <Route path="/patients/:patientId/clinical-record" element={<ClinicalRecordView />} />
          <Route path="/patients/:patientId/clinical-evolutions" element={<ClinicalEvolutionsListView />} />
          <Route path="/patients/:patientId/clinical-evolutions/new" element={<ClinicalEvolutionCreateView />} />
          <Route path="/patients/:patientId/clinical-files" element={<ClinicalFilesListView />} />

          {/* Doctores */}
          <Route path="/doctors" element={<DoctorsListView />} />
          <Route path="/doctors/new" element={<DoctorCreateView />} />
          <Route path="/doctors/:id" element={<DoctorDetailView />} />
          <Route path="/doctors/:id/edit" element={<DoctorEditView />} />

          {/* Citas */}
          <Route path="/appointments" element={<AppointmentsListView />} />
          <Route path="/appointments/new" element={<AppointmentCreateView />} />
          <Route path="/appointments/agenda" element={<AppointmentAgendaView />} />
          <Route path="/appointments/:id" element={<AppointmentDetailView />} />

          {/* Tratamientos (catálogo) */}
          <Route path="/treatments" element={<TreatmentsListView />} />
          <Route path="/treatments/new" element={<TreatmentCreateView />} />
          <Route path="/treatments/:id/edit" element={<TreatmentEditView />} />

          {/* Planes de tratamiento */}
          <Route path="/treatment-plans" element={<TreatmentPlansListView />} />
          <Route path="/treatment-plans/new" element={<TreatmentPlanCreateView />} />
          <Route path="/treatment-plans/:id" element={<TreatmentPlanDetailView />} />

          {/* Procedimientos realizados */}
          <Route path="/performed-procedures" element={<PerformedProceduresListView />} />
          <Route path="/performed-procedures/new" element={<PerformedProcedureCreateView />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
