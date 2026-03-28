import type { RouteObject } from 'react-router-dom';
import DashboardView from '../views/DashboardView';

export const dashboardRoutes: RouteObject[] = [
  { path: '/', element: <DashboardView /> },
];
