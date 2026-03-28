import type { RouteObject } from 'react-router-dom';
import TreatmentsListView from '../views/TreatmentsListView';
import TreatmentCreateView from '../views/TreatmentCreateView';
import TreatmentEditView from '../views/TreatmentEditView';

export const treatmentsRoutes: RouteObject[] = [
  { path: '/treatments', element: <TreatmentsListView /> },
  { path: '/treatments/new', element: <TreatmentCreateView /> },
  { path: '/treatments/:id/edit', element: <TreatmentEditView /> },
];
