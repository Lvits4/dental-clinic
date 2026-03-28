import type { RouteObject } from 'react-router-dom';
import ClinicalRecordView from '../views/ClinicalRecordView';

export const clinicalRecordsRoutes: RouteObject[] = [
  { path: '/patients/:id/clinical-record', element: <ClinicalRecordView /> },
];
