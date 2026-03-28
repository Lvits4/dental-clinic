import type { RouteObject } from 'react-router-dom';
import PatientsListView from '../views/PatientsListView';
import PatientCreateView from '../views/PatientCreateView';
import PatientEditView from '../views/PatientEditView';
import PatientDetailView from '../views/PatientDetailView';

export const patientsRoutes: RouteObject[] = [
  { path: '/patients', element: <PatientsListView /> },
  { path: '/patients/new', element: <PatientCreateView /> },
  { path: '/patients/:id', element: <PatientDetailView /> },
  { path: '/patients/:id/edit', element: <PatientEditView /> },
];
