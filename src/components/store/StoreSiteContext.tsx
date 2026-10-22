'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { StoreSite } from '@/lib/storeSite';

const Ctx = createContext<StoreSite | null>(null);

export function StoreSiteProvider({ site, children }: { site: StoreSite; children: ReactNode }) {
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}

export function useStoreSite(): StoreSite {
  const site = useContext(Ctx);
  if (!site) throw new Error('useStoreSite() outside <StoreSiteProvider>');
  return site;
}
