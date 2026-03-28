import type { RouteObject } from 'react-router-dom';
import PerformedProceduresListView from '../views/PerformedProceduresListView';
import PerformedProcedureCreateView from '../views/PerformedProcedureCreateView';

export const performedProceduresRoutes: RouteObject[] = [
  { path: '/performed-procedures', element: <PerformedProceduresListView /> },
  { path: '/performed-procedures/new', element: <PerformedProcedureCreateView /> },
];
