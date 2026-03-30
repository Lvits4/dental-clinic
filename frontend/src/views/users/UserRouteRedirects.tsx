import { Navigate, useParams } from 'react-router-dom';

/** Estado de ubicación para abrir el modal de usuario desde redirecciones. */
export type UserModalLocationState = {
  openUserModal?: 'create' | 'edit';
  userId?: string;
};

export function RedirectUserNewToList() {
  return (
    <Navigate
      to="/users"
      replace
      state={{ openUserModal: 'create' } satisfies UserModalLocationState}
    />
  );
}

export function RedirectUserEditToList() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/users" replace />;
  }
  return (
    <Navigate
      to="/users"
      replace
      state={{ openUserModal: 'edit', userId: id } satisfies UserModalLocationState}
    />
  );
}
