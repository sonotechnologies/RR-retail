'use client';

import type { BagMode } from '@/lib/store';

/** Segmented Retail / Wholesale. */
export function ModeToggle({ mode, onChange }: { mode: BagMode; onChange: (m: BagMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Buy retail or wholesale" className="flex rounded-full border border-line bg-surface p-1">
      {(['retail', 'wholesale'] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className={`h-10 flex-1 rounded-full text-[14px] font-extrabold transition-colors duration-200 ${mode === m ? 'bg-accent text-ink' : 'text-muted hover:text-text'}`}
        >
          {m === 'retail' ? 'Retail' : 'Wholesale'}
        </button>
      ))}
    </div>
  );
}
