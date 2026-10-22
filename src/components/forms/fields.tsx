'use client';

import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | false;
  multiline?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

/** Underline input. States: default (placeholder), focus (accent label + 2px accent line), filled, error. */
export function Field({ label, value, onChange, error, multiline, className = '', ...rest }: FieldProps) {
  const id = useId();
  const [focus, setFocus] = useState(false);
  const raised = focus || !!value || rest.type === 'date';
  const line = error ? 'border-error' : focus ? 'border-accent border-b-2 pb-[9px]' : value ? 'border-text' : 'border-line';
  const common = {
    id,
    value,
    placeholder: raised ? undefined : label,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    'aria-invalid': !!error || undefined,
    'aria-describedby': error ? `${id}-err` : undefined,
    className: `w-full min-w-0 border-0 border-b bg-transparent pt-1 pb-2.5 text-[16px] text-text outline-none transition-colors [color-scheme:inherit] ${line}`,
  };
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className={raised ? `label text-[11px] ${error ? 'text-error' : focus ? 'text-accent' : 'text-muted'}` : 'sr-only'}>
        {label}
      </label>
      {multiline ? (
        <textarea {...common} rows={2} onChange={(e) => onChange(e.target.value)} className={`${common.className} resize-none`} />
      ) : (
        <input {...rest} {...common} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <span id={`${id}-err`} className="text-[13px] text-error">
          {error}
        </span>
      )}
    </div>
  );
}

export function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-3">
      <legend className="label mb-3 text-muted">{label}</legend>
      {children}
    </fieldset>
  );
}

type ChipsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  disabled?: (v: T) => boolean;
  label?: (v: T) => ReactNode;
  layout?: 'wrap' | 'grid3';
  name: string;
};

/** Chip selector (time slots, sizes, budgets). Selected: filled; unavailable: struck through. */
export function Chips<T extends string>({ options, value, onChange, disabled, label, layout = 'wrap', name }: ChipsProps<T>) {
  return (
    <div role="radiogroup" aria-label={name} className={layout === 'grid3' ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}>
      {options.map((o) => {
        const on = o === value;
        const off = disabled?.(o) ?? false;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={off}
            onClick={() => onChange(o)}
            className={[
              'border text-[14px] font-semibold transition-colors',
              layout === 'grid3' ? 'rounded-card px-1.5 py-3.5 text-center' : 'rounded-full px-4 py-[11px]',
              on ? 'border-text bg-text text-bg' : off ? 'border-line text-muted line-through' : 'border-line hover:border-text',
            ].join(' ')}
          >
            {label ? label(o) : o}
          </button>
        );
      })}
    </div>
  );
}

export function Stepper({ value, onChange, min = 1, max = 99, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  const btn = 'flex size-11 items-center justify-center rounded-full border border-line text-[20px] transition-colors hover:border-text disabled:opacity-40 lg:size-10';
  return (
    <span className="flex items-center gap-1">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}>
        −
      </button>
      <span className="min-w-9 text-center text-[18px] font-bold" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>
        +
      </button>
    </span>
  );
}
