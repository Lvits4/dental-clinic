import type { RouteObject } from 'react-router-dom';
import ClinicalEvolutionsListView from '../views/ClinicalEvolutionsListView';
import ClinicalEvolutionCreateView from '../views/ClinicalEvolutionCreateView';

export const clinicalEvolutionsRoutes: RouteObject[] = [
  { path: '/patients/:id/evolutions', element: <ClinicalEvolutionsListView /> },
  { path: '/patients/:id/evolutions/new', element: <ClinicalEvolutionCreateView /> },
];
