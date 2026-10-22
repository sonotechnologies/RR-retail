'use client';

import { useEffect, useRef } from 'react';
import { bagCount } from '@/lib/store';
import { useBag } from './bag';
import { useBagHydrated } from './BagHydrator';

/** Bag count (0 until hydrated) and a ref that bounces when it goes up. */
export function useBagCount() {
  const hydrated = useBagHydrated();
  const count = useBag((s) => (hydrated ? bagCount(s.lines) : 0));
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(count);
  useEffect(() => {
    if (hydrated && count > prev.current && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' });
    }
    prev.current = count;
  }, [count, hydrated]);
  return { count, ref };
}
