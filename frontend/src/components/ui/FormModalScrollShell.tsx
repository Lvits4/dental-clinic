import type { ReactNode } from 'react';

/**
 * Envoltorio para el cuerpo de un modal con `containBodyHeight`: permite que el formulario hijo
 * use `fillParent` y deje el scroll solo en el contenido, con la barra de acciones fija abajo.
 */
const FormModalScrollShell = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
);

export default FormModalScrollShell;
