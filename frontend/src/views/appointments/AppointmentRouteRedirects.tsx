import { Navigate } from 'react-router-dom';

/** Estado de ubicación para abrir el modal de nueva cita desde redirecciones. */
export type AppointmentModalLocationState = {
  openAppointmentModal?: 'create';
};

export function RedirectAppointmentNewToList() {
  return (
    <Navigate
      to="/appointments"
      replace
      state={{ openAppointmentModal: 'create' } satisfies AppointmentModalLocationState}
    />
  );
}
