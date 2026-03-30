import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Role } from './enums';
import { RedirectPatientEditToDetail, RedirectPatientNewToList } from './views/patients/PatientRouteRedirects';
import { RedirectTreatmentEditToList, RedirectTreatmentNewToList } from './views/treatments/TreatmentRouteRedirects';
import { RedirectDoctorEditToList, RedirectDoctorNewToList } from './views/doctors/DoctorRouteRedirects';
import { RedirectUserEditToList, RedirectUserNewToList } from './views/users/UserRouteRedirects';

// ─── Spinner de carga ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
const LoginView = React.lazy(() => import('./views/LoginView'));
const RegisterView = React.lazy(() => import('./views/RegisterView'));

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const DashboardView = React.lazy(() => import('./views/DashboardView'));

// ─── Patients ──────────────────────────────────────────────────────────────────
const PatientsListView = React.lazy(() => import('./views/patients/PatientsListView'));
const PatientDetailView = React.lazy(() => import('./views/patients/PatientDetailView'));

// ─── Doctors ───────────────────────────────────────────────────────────────────
const DoctorsListView = React.lazy(() => import('./views/doctors/DoctorsListView'));
const DoctorDetailView = React.lazy(() => import('./views/doctors/DoctorDetailView'));

// ─── Appointments ──────────────────────────────────────────────────────────────
const AppointmentsListView = React.lazy(() => import('./views/appointments/AppointmentsListView'));
const AppointmentCreateView = React.lazy(() => import('./views/appointments/AppointmentCreateView'));
const AppointmentAgendaView = React.lazy(() => import('./views/appointments/AppointmentAgendaView'));

// ─── Treatments ────────────────────────────────────────────────────────────────
const TreatmentsListView = React.lazy(() => import('./views/treatments/TreatmentsListView'));

// ─── Treatment Plans ───────────────────────────────────────────────────────────
const TreatmentPlansListView = React.lazy(() => import('./views/treatment-plans/TreatmentPlansListView'));
const TreatmentPlanDetailView = React.lazy(() => import('./views/treatment-plans/TreatmentPlanDetailView'));

// ─── Performed Procedures ──────────────────────────────────────────────────────
const PerformedProceduresListView = React.lazy(() => import('./views/performed-procedures/PerformedProceduresListView'));
const PerformedProcedureCreateView = React.lazy(() => import('./views/performed-procedures/PerformedProcedureCreateView'));

// ─── Clinical ──────────────────────────────────────────────────────────────────
const ClinicalRecordView = React.lazy(() => import('./views/clinical-records/ClinicalRecordView'));
const ClinicalEvolutionsListView = React.lazy(() => import('./views/clinical-evolutions/ClinicalEvolutionsListView'));
const ClinicalEvolutionCreateView = React.lazy(() => import('./views/clinical-evolutions/ClinicalEvolutionCreateView'));
const ClinicalFilesListView = React.lazy(() => import('./views/clinical-files/ClinicalFilesListView'));

// ─── Users (Admin only) ────────────────────────────────────────────────────────
const UsersListView = React.lazy(() => import('./views/users/UsersListView'));
const AccountView = React.lazy(() => import('./views/account/AccountView'));

// ─── Ruta admin-only ───────────────────────────────────────────────────────────
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== Role.ADMIN) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// ─── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas de autenticacion */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<DashboardView />} />

            {/* Cuenta del usuario autenticado */}
            <Route path="/account" element={<AccountView />} />

            {/* Pacientes */}
            <Route path="/patients" element={<PatientsListView />} />
            <Route path="/patients/new" element={<RedirectPatientNewToList />} />
            <Route path="/patients/:id/edit" element={<RedirectPatientEditToDetail />} />
            <Route path="/patients/:id" element={<PatientDetailView />} />

            {/* Expediente clinico (anidados a paciente) */}
            <Route path="/patients/:id/clinical-record" element={<ClinicalRecordView />} />
            <Route path="/patients/:id/evolutions" element={<ClinicalEvolutionsListView />} />
            <Route path="/patients/:id/evolutions/new" element={<ClinicalEvolutionCreateView />} />
            <Route path="/patients/:id/clinical-files" element={<ClinicalFilesListView />} />

            {/* Doctores */}
            <Route path="/doctors" element={<DoctorsListView />} />
            <Route path="/doctors/new" element={<RedirectDoctorNewToList />} />
            <Route path="/doctors/:id/edit" element={<RedirectDoctorEditToList />} />
            <Route path="/doctors/:id" element={<DoctorDetailView />} />

            {/* Citas */}
            <Route path="/appointments" element={<AppointmentsListView />} />
            <Route path="/appointments/new" element={<AppointmentCreateView />} />
            <Route path="/appointments/agenda" element={<AppointmentAgendaView />} />
            <Route path="/appointments/:id" element={<Navigate to="/appointments" replace />} />

            {/* Tratamientos (catalogo) */}
            <Route path="/treatments" element={<TreatmentsListView />} />
            <Route path="/treatments/new" element={<RedirectTreatmentNewToList />} />
            <Route path="/treatments/:id/edit" element={<RedirectTreatmentEditToList />} />

            {/* Planes de tratamiento */}
            <Route path="/treatment-plans" element={<TreatmentPlansListView />} />
            <Route path="/treatment-plans/new" element={<Navigate to="/treatment-plans" replace />} />
            <Route path="/treatment-plans/:id" element={<TreatmentPlanDetailView />} />

            {/* Procedimientos realizados */}
            <Route path="/performed-procedures" element={<PerformedProceduresListView />} />
            <Route path="/performed-procedures/new" element={<PerformedProcedureCreateView />} />

            {/* Usuarios (solo admin) */}
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UsersListView />
                </AdminRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <AdminRoute>
                  <RedirectUserNewToList />
                </AdminRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <AdminRoute>
                  <RedirectUserEditToList />
                </AdminRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
