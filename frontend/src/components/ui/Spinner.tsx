export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

const Spinner = ({
  size = 'md',
  color = 'border-emerald-500',
  label = 'Cargando...',
}: SpinnerProps) => {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={[
          'rounded-full border-t-transparent animate-spin',
          sizeClasses[size],
          color,
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;
