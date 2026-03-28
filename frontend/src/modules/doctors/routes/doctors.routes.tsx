import type { RouteObject } from 'react-router-dom';
import DoctorsListView from '../views/DoctorsListView';
import DoctorCreateView from '../views/DoctorCreateView';
import DoctorEditView from '../views/DoctorEditView';
import DoctorDetailView from '../views/DoctorDetailView';

export const doctorsRoutes: RouteObject[] = [
  { path: '/doctors', element: <DoctorsListView /> },
  { path: '/doctors/new', element: <DoctorCreateView /> },
  { path: '/doctors/:id', element: <DoctorDetailView /> },
  { path: '/doctors/:id/edit', element: <DoctorEditView /> },
];
