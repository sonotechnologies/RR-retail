'use client';

import { useHydrated } from './CartHydrator';
import { useCart } from './store';

/** "Added" state on a dish photo: an inset accent ring while it is in the cart. */
export function InCartRing({ id }: { id: string }) {
  const hydrated = useHydrated();
  const inCart = useCart((s) => s.lines.some((l) => l.id === id));
  if (!hydrated || !inCart) return null;
  return <span aria-hidden className="pointer-events-none absolute inset-0 rounded-card shadow-[inset_0_0_0_3px_var(--accent)]" />;
}
