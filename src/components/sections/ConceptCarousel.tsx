'use client';

import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionTier } from '@/components/motion/tier';

/** Mobile: scroll-snap row where the card in view scales up. Desktop: a grid (the pin track). */
export function ConceptCarousel({ children }: { children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { desktop, reduced } = useMotionTier();
  const scale = !desktop && !reduced;

  useEffect(() => {
    const el = row.current;
    if (!el || !scale) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { root: el, threshold: 0.7 },
    );
    [...el.children].forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [scale]);

  return (
    <div className="-mx-5 lg:mx-0">
      <div
        ref={row}
        data-pin-track
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:gap-5 lg:overflow-visible lg:px-0"
      >
        {Children.map(children, (child, i) => (
          <div
            data-i={i}
            className="shrink-0 snap-start origin-bottom transition-transform duration-500 ease-out-expo lg:shrink"
            style={scale ? { transform: `scale(${i === active ? 1 : 0.94})` } : undefined}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
