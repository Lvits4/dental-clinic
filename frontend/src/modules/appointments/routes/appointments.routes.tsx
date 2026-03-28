import type { RouteObject } from 'react-router-dom';
import AppointmentsListView from '../views/AppointmentsListView';
import AppointmentCreateView from '../views/AppointmentCreateView';
import AppointmentDetailView from '../views/AppointmentDetailView';
import AppointmentAgendaView from '../views/AppointmentAgendaView';

export const appointmentsRoutes: RouteObject[] = [
  { path: '/appointments', element: <AppointmentsListView /> },
  { path: '/appointments/new', element: <AppointmentCreateView /> },
  { path: '/appointments/agenda', element: <AppointmentAgendaView /> },
  { path: '/appointments/:id', element: <AppointmentDetailView /> },
];
