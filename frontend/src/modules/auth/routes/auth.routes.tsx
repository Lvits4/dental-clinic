import type { RouteObject } from 'react-router-dom';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';

export const authRoutes: RouteObject[] = [
  { path: '/login', element: <LoginView /> },
  { path: '/register', element: <RegisterView /> },
];
