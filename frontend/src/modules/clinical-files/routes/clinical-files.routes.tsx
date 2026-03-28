import type { RouteObject } from 'react-router-dom';
import ClinicalFilesListView from '../views/ClinicalFilesListView';

export const clinicalFilesRoutes: RouteObject[] = [
  { path: '/patients/:id/files', element: <ClinicalFilesListView /> },
];
