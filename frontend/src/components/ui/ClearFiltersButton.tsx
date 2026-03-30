export interface ClearFiltersButtonProps {
  onClick: () => void;
  /** Clases extra (p. ej. alinear en un flex row con chips) */
  className?: string;
}

/**
 * Acción secundaria estándar para reiniciar filtros de listas (mismo aspecto en todas las vistas).
 */
const ClearFiltersButton = ({ onClick, className = '' }: ClearFiltersButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline self-start transition-colors',
      'rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    Limpiar filtros
  </button>
);

export default ClearFiltersButton;
