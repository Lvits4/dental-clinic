import type { ReactNode } from 'react';

export interface FormActionBarProps {
  children?: ReactNode;
  className?: string;
  /**
   * form: borde superior y fondo como pie de formulario dentro del cuerpo del modal.
   * modalFooter: sin borde extra; el Modal ya aporta borde y fondo del footer.
   */
  variant?: 'form' | 'modalFooter';
  /**
   * Secundarios agrupados a la izquierda (p. ej. Cancelar + Anterior); la acción principal
   * va en `right`, separada con margen (botón verde / primario).
   */
  left?: ReactNode;
  right?: ReactNode;
  /** Una sola acción alineada al final (sin fila split). */
  end?: ReactNode;
}

const formShellClass =
  'shrink-0 mt-4 border-t border-slate-100 pt-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20';

/**
 * Franja estándar de acciones: secundarios juntos a la izquierda, primario separado a la derecha.
 */
const FormActionBar = ({
  children,
  className = '',
  variant = 'form',
  left,
  right,
  end,
}: FormActionBarProps) => {
  const shell =
    variant === 'form'
      ? [formShellClass, className].filter(Boolean).join(' ')
      : ['w-full min-w-0', className].filter(Boolean).join(' ');

  if (end != null) {
    return (
      <div className={shell}>
        <div className="flex w-full justify-end">{end}</div>
      </div>
    );
  }

  if (left != null || right != null) {
    return (
      <div className={shell}>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-x-8 gap-y-3 sm:gap-x-10">
          <div className="flex min-w-0 flex-wrap items-center gap-2">{left}</div>
          <div className="ml-auto flex shrink-0 items-center">{right}</div>
        </div>
      </div>
    );
  }

  return <div className={shell}>{children}</div>;
};

export default FormActionBar;
