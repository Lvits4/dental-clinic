import type { RouteObject } from 'react-router-dom';
import TreatmentPlansListView from '../views/TreatmentPlansListView';
import TreatmentPlanCreateView from '../views/TreatmentPlanCreateView';
import TreatmentPlanDetailView from '../views/TreatmentPlanDetailView';

export const treatmentPlansRoutes: RouteObject[] = [
  { path: '/treatment-plans', element: <TreatmentPlansListView /> },
  { path: '/treatment-plans/new', element: <TreatmentPlanCreateView /> },
  { path: '/treatment-plans/:id', element: <TreatmentPlanDetailView /> },
];
