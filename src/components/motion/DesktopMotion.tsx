'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useCart } from '@/components/cart/store';
import { useMotionTier } from './tier';

type Mod = typeof import('./desktop');

/** Loads the desktop tier (Lenis, GSAP ScrollTrigger, custom cursor) only where it applies. */
export function DesktopMotion() {
  const { desktop, reduced } = useMotionTier();
  const pathname = usePathname();
  const mod = useRef<Mod | null>(null);
  const cartOpen = useCart((s) => s.open);

  useEffect(() => {
    if (!desktop || reduced) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    import('./desktop').then((m) => {
      if (cancelled) return;
      mod.current = m;
      stop = m.start();
      m.scan();
    });
    return () => {
      cancelled = true;
      stop?.();
      mod.current = null;
    };
  }, [desktop, reduced]);

  useEffect(() => {
    mod.current?.scan();
  }, [pathname]);

  useEffect(() => {
    mod.current?.pause(cartOpen);
  }, [cartOpen]);

  return null;
}
