import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { Photo } from '@/components/ui/Photo';

/** Secondary page shell: photo on top (mobile) or pinned left (desktop), content right. */
export function FormPage({ image, media, label, title, lead, children }: { image?: string; media?: ReactNode; label: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-2">
      <div className="relative lg:sticky lg:top-[76px] lg:h-[calc(100svh-76px)]">
        {media ?? (
          <div className="relative h-[220px] overflow-hidden bg-line lg:h-full">
            {image && <Photo src={image} alt="" priority sizes="(min-width:1024px) 50vw, 100vw" />}
          </div>
        )}
      </div>
      <div className="px-5 pt-8 pb-12 lg:px-16 lg:pt-20 lg:pb-[140px] xl:px-24">
        <div className="mx-auto flex max-w-[560px] flex-col gap-7 lg:mx-0 lg:gap-10">
          <Reveal className="flex flex-col gap-2.5 lg:gap-3.5">
            <p className="label text-muted">{label}</p>
            <h1 className="t-h1">{title}</h1>
            {lead && <div className="text-[15px] leading-[1.6] text-muted lg:text-[17px]">{lead}</div>}
          </Reveal>
          {children}
        </div>
      </div>
    </div>
  );
}
