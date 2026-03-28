import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import { authRoutes } from '../../modules/auth/routes/auth.routes';
import { dashboardRoutes } from '../../modules/dashboard/routes/dashboard.routes';
import { patientsRoutes } from '../../modules/patients/routes/patients.routes';
import { doctorsRoutes } from '../../modules/doctors/routes/doctors.routes';
import { appointmentsRoutes } from '../../modules/appointments/routes/appointments.routes';
import { treatmentsRoutes } from '../../modules/treatments/routes/treatments.routes';
import { treatmentPlansRoutes } from '../../modules/treatment-plans/routes/treatment-plans.routes';
import { performedProceduresRoutes } from '../../modules/performed-procedures/routes/performed-procedures.routes';
import { clinicalRecordsRoutes } from '../../modules/clinical-records/routes/clinical-records.routes';
import { clinicalEvolutionsRoutes } from '../../modules/clinical-evolutions/routes/clinical-evolutions.routes';
import { clinicalFilesRoutes } from '../../modules/clinical-files/routes/clinical-files.routes';

// Placeholder temporal para módulos pendientes
const Placeholder = ({ title }: { title: string }) => (
  <div className="py-4">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
    <p className="mt-2 text-gray-500 dark:text-gray-400">Módulo en construcción...</p>
  </div>
);

export const routes: RouteObject[] = [
  // Rutas de autenticación (sin navbar)
  {
    element: <AuthLayout />,
    children: authRoutes,
  },

  // Rutas protegidas (con navbar)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Dashboard
          ...dashboardRoutes,

          // Pacientes
          ...patientsRoutes,
          ...clinicalRecordsRoutes,
          ...clinicalEvolutionsRoutes,
          ...clinicalFilesRoutes,
          { path: '/patients/:id/treatment-plans', element: <Placeholder title="Planes del Paciente" /> },

          // Doctores
          ...doctorsRoutes,

          // Citas
          ...appointmentsRoutes,

          // Tratamientos (catálogo)
          ...treatmentsRoutes,

          // Planes de tratamiento
          ...treatmentPlansRoutes,

          // Procedimientos realizados
          ...performedProceduresRoutes,

          // Auditoría
          { path: '/audit', element: <Placeholder title="Registro de Auditoría" /> },

          // 404
          { path: '*', element: <Placeholder title="404 — Página no encontrada" /> },
        ],
      },
    ],
  },
];
