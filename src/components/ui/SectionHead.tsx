import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';

/** Small caps label over a serif h1, with an optional aside on desktop. */
export function SectionHead({ label, title, aside, className = '' }: { label: string; title: string; aside?: ReactNode; className?: string }) {
  return (
    <div className={`grid items-end gap-2.5 lg:grid-cols-2 lg:gap-12 ${className}`}>
      <Reveal className="flex flex-col gap-2.5 lg:gap-3.5">
        <p className="label text-muted">{label}</p>
        <h2 className="t-h1">{title}</h2>
      </Reveal>
      {aside && (
        <Reveal index={1} className="hidden lg:block lg:justify-self-end">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
