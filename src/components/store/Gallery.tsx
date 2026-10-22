'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowLeft } from '@/components/ui/icons';
import { Photo } from '@/components/ui/Photo';

/** Swipeable photos with snap on mobile (n/N counter); stacked photos on desktop. */
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const router = useRouter();
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const shots = images.length ? images : [''];
  const back = () => (history.length > 1 ? router.back() : router.push('/shop'));
  const onScroll = () => {
    const el = track.current;
    if (el) setI(Math.round(el.scrollLeft / el.clientWidth));
  };
  return (
    <div className="relative lg:sticky lg:top-[96px] lg:self-start">
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-2.5 lg:overflow-visible"
        aria-label={`${name} photos`}
      >
        {shots.map((src, n) => (
          <div key={n} className={`relative aspect-[4/5] w-full shrink-0 snap-start bg-surface lg:overflow-hidden lg:rounded-card ${n === 0 && shots.length % 2 === 1 ? 'lg:col-span-2' : ''}`}>
            {src && <Photo src={src} alt={`${name}, photo ${n + 1}`} priority={n === 0} tint="#1B1917" sizes="(min-width:1024px) 50vw, 100vw" />}
          </div>
        ))}
      </div>
      {shots.length > 1 && (
        <span className="absolute right-3.5 bottom-3.5 rounded-full bg-bg/70 px-2.5 py-1 text-[11px] font-bold lg:hidden" aria-hidden>
          {i + 1}/{shots.length}
        </span>
      )}
      <button type="button" onClick={back} aria-label="Back" className="absolute top-3 left-3 flex size-11 items-center justify-center rounded-full bg-bg/75 lg:hidden">
        <ArrowLeft width={20} height={20} />
      </button>
    </div>
  );
}
