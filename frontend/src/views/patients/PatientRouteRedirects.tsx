import { Navigate, useParams } from 'react-router-dom';

/** Estado de ubicación para abrir el modal de paciente desde redirecciones. */
export type PatientModalLocationState = {
  openPatientModal?: 'create' | 'edit';
};

export function RedirectPatientNewToList() {
  return (
    <Navigate
      to="/patients"
      replace
      state={{ openPatientModal: 'create' } satisfies PatientModalLocationState}
    />
  );
}

export function RedirectPatientEditToDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/patients" replace />;
  }
  return (
    <Navigate
      to={`/patients/${id}`}
      replace
      state={{ openPatientModal: 'edit' } satisfies PatientModalLocationState}
    />
  );
}
