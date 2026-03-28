import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import { authRoutes } from '../../modules/auth/routes/auth.routes';

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
          { path: '/', element: <Placeholder title="Dashboard" /> },

          // Pacientes
          { path: '/patients', element: <Placeholder title="Pacientes" /> },
          { path: '/patients/new', element: <Placeholder title="Nuevo Paciente" /> },
          { path: '/patients/:id', element: <Placeholder title="Detalle de Paciente" /> },
          { path: '/patients/:id/edit', element: <Placeholder title="Editar Paciente" /> },
          { path: '/patients/:id/clinical-record', element: <Placeholder title="Expediente Clínico" /> },
          { path: '/patients/:id/evolutions', element: <Placeholder title="Evoluciones Clínicas" /> },
          { path: '/patients/:id/evolutions/new', element: <Placeholder title="Nueva Evolución" /> },
          { path: '/patients/:id/evolutions/:evoId', element: <Placeholder title="Detalle de Evolución" /> },
          { path: '/patients/:id/files', element: <Placeholder title="Archivos Clínicos" /> },
          { path: '/patients/:id/treatment-plans', element: <Placeholder title="Planes del Paciente" /> },

          // Doctores
          { path: '/doctors', element: <Placeholder title="Doctores" /> },
          { path: '/doctors/new', element: <Placeholder title="Nuevo Doctor" /> },
          { path: '/doctors/:id', element: <Placeholder title="Detalle de Doctor" /> },
          { path: '/doctors/:id/edit', element: <Placeholder title="Editar Doctor" /> },

          // Citas
          { path: '/appointments', element: <Placeholder title="Citas" /> },
          { path: '/appointments/new', element: <Placeholder title="Nueva Cita" /> },
          { path: '/appointments/:id', element: <Placeholder title="Detalle de Cita" /> },
          { path: '/appointments/agenda', element: <Placeholder title="Agenda" /> },

          // Tratamientos (catálogo)
          { path: '/treatments', element: <Placeholder title="Catálogo de Tratamientos" /> },
          { path: '/treatments/new', element: <Placeholder title="Nuevo Tratamiento" /> },
          { path: '/treatments/:id/edit', element: <Placeholder title="Editar Tratamiento" /> },

          // Planes de tratamiento
          { path: '/treatment-plans', element: <Placeholder title="Planes de Tratamiento" /> },
          { path: '/treatment-plans/new', element: <Placeholder title="Nuevo Plan" /> },
          { path: '/treatment-plans/:id', element: <Placeholder title="Detalle de Plan" /> },

          // Procedimientos realizados
          { path: '/performed-procedures', element: <Placeholder title="Procedimientos Realizados" /> },
          { path: '/performed-procedures/new', element: <Placeholder title="Nuevo Procedimiento" /> },
          { path: '/performed-procedures/:id', element: <Placeholder title="Detalle de Procedimiento" /> },

          // Auditoría
          { path: '/audit', element: <Placeholder title="Registro de Auditoría" /> },

          // 404
          { path: '*', element: <Placeholder title="404 — Página no encontrada" /> },
        ],
      },
    ],
  },
];
