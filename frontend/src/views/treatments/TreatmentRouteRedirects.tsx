import { Navigate, useParams } from 'react-router-dom';

/** Estado de ubicación para abrir el modal de tratamiento desde redirecciones. */
export type TreatmentModalLocationState = {
  openTreatmentModal?: 'create' | 'edit';
  treatmentId?: string;
};

export function RedirectTreatmentNewToList() {
  return (
    <Navigate
      to="/treatments"
      replace
      state={{ openTreatmentModal: 'create' } satisfies TreatmentModalLocationState}
    />
  );
}

export function RedirectTreatmentEditToList() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/treatments" replace />;
  }
  return (
    <Navigate
      to="/treatments"
      replace
      state={{
        openTreatmentModal: 'edit',
        treatmentId: id,
      } satisfies TreatmentModalLocationState}
    />
  );
}
