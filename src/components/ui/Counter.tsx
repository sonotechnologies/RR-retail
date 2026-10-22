'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionTier } from '@/components/motion/tier';

/** Capacity numbers tick up when they scroll into view (desktop only; static on mobile). */
export function Counter({ value }: { value: number }) {
  const { desktop, reduced } = useMotionTier();
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!desktop || reduced || !el) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 900);
        setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [desktop, reduced, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n ?? value}
    </span>
  );
}
