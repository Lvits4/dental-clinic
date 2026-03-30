import { Navigate, useParams } from 'react-router-dom';

/** Estado de ubicación para abrir el modal de doctor desde redirecciones. */
export type DoctorModalLocationState = {
  openDoctorModal?: 'create' | 'edit';
  doctorId?: string;
};

export function RedirectDoctorNewToList() {
  return (
    <Navigate
      to="/doctors"
      replace
      state={{ openDoctorModal: 'create' } satisfies DoctorModalLocationState}
    />
  );
}

export function RedirectDoctorEditToList() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/doctors" replace />;
  }
  return (
    <Navigate
      to="/doctors"
      replace
      state={
        { openDoctorModal: 'edit', doctorId: id } satisfies DoctorModalLocationState
      }
    />
  );
}
