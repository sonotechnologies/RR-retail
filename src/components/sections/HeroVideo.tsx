'use client';

import { useMotionTier } from '@/components/motion/tier';

/** Muted loop, desktop only: mobile keeps the poster image (LCP + data). */
export function HeroVideo({ src }: { src: string }) {
  const { desktop, reduced } = useMotionTier();
  if (!desktop || reduced) return null;
  return <video src={src} autoPlay muted loop playsInline preload="none" aria-hidden className="absolute inset-0 size-full object-cover" />;
}
