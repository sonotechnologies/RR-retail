'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useBag } from './bag';

/** Restores the persisted bag after mount (per skin), so SSR and the first client render match. */
export function BagHydrator({ skinId }: { skinId: string }) {
  useEffect(() => {
    useBag.persist.setOptions({ name: `bag:${skinId}` });
    void useBag.persist.rehydrate();
  }, [skinId]);
  return null;
}

const sub = (cb: () => void) => useBag.persist.onFinishHydration(cb);

export function useBagHydrated() {
  return useSyncExternalStore(sub, () => useBag.persist.hasHydrated(), () => false);
}
