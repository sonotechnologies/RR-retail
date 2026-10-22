'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useCart } from './store';

/** Restores the persisted cart after mount (per skin), so SSR and the first client render match. */
export function CartHydrator({ skinId }: { skinId: string }) {
  useEffect(() => {
    useCart.persist.setOptions({ name: `cart:${skinId}` });
    void useCart.persist.rehydrate();
  }, [skinId]);
  return null;
}

const sub = (cb: () => void) => useCart.persist.onFinishHydration(cb);

export function useHydrated() {
  return useSyncExternalStore(sub, () => useCart.persist.hasHydrated(), () => false);
}
