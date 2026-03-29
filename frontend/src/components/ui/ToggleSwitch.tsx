export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const sizes = {
  sm: {
    track: 'w-8 h-[18px]',
    thumb: 'w-3.5 h-3.5',
    translate: 'translate-x-[14px]',
    label: 'text-sm',
  },
  md: {
    track: 'w-10 h-[22px]',
    thumb: 'w-4 h-4',
    translate: 'translate-x-[18px]',
    label: 'text-sm',
  },
};

const ToggleSwitch = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}: ToggleSwitchProps) => {
  const s = sizes[size];

  return (
    <label
      className={[
        'inline-flex items-center gap-2.5 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          s.track,
          'relative inline-flex items-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500/30',
          checked
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
            : 'bg-slate-200 dark:bg-slate-700',
        ].join(' ')}
      >
        <span
          className={[
            s.thumb,
            'rounded-lg bg-white shadow-sm transition-transform duration-200',
            'absolute left-[3px]',
            checked ? s.translate : 'translate-x-0',
          ].join(' ')}
        />
      </button>

      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className={`${s.label} font-medium text-slate-700 dark:text-slate-200 leading-tight`}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;
