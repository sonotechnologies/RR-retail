'use client';

import { useSyncExternalStore } from 'react';

// Tier is detected once per media-query change: desktop = wide + fine pointer.
const DESKTOP = '(min-width: 1024px) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

function subscribe(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  };
}
const subDesktop = subscribe(DESKTOP);
const subReduced = subscribe(REDUCED);

export const isDesktop = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP).matches;
export const isReduced = () => typeof window !== 'undefined' && window.matchMedia(REDUCED).matches;

/** Server render assumes the mobile tier with motion on. */
export function useMotionTier() {
  const desktop = useSyncExternalStore(subDesktop, isDesktop, () => false);
  const reduced = useSyncExternalStore(subReduced, isReduced, () => false);
  return { desktop, reduced };
}
