interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`${sizeClasses[size]} border-emerald-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
