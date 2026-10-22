'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  concept: string; // slug
  image?: string;
};
export type CartLine = CartProduct & { qty: number };

type Toast = { id: string; name: string; key: number } | null;

type CartState = {
  lines: CartLine[];
  mode: 'delivery' | 'pickup';
  form: { name: string; phone: string; address: string; note: string };
  /** Set after "Send order on WhatsApp"; shows "Order sent? Clear cart". */
  sentAt: number | null;
  open: boolean;
  toast: Toast;
  add: (p: CartProduct) => void;
  dec: (id: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setMode: (mode: 'delivery' | 'pickup') => void;
  setField: (k: keyof CartState['form'], v: string) => void;
  markSent: () => void;
  undo: () => void;
  hideToast: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      mode: 'delivery',
      form: { name: '', phone: '', address: '', note: '' },
      sentAt: null,
      open: false,
      toast: null,
      add: (p) => {
        const lines = get().lines;
        const hit = lines.find((l) => l.id === p.id);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => set({ toast: null }), 2600);
        set({
          lines: hit ? lines.map((l) => (l.id === p.id ? { ...l, ...p, qty: l.qty + 1 } : l)) : [...lines, { ...p, qty: 1 }],
          toast: { id: p.id, name: p.name, key: Date.now() },
          sentAt: null,
        });
      },
      dec: (id) =>
        set((s) => ({ lines: s.lines.flatMap((l) => (l.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [])), sentAt: null })),
      clear: () => set({ lines: [], sentAt: null, form: { ...get().form, note: '' } }),
      setOpen: (open) => set({ open, toast: open ? null : get().toast }),
      setMode: (mode) => set({ mode }),
      setField: (k, v) => set((s) => ({ form: { ...s.form, [k]: v } })),
      markSent: () => set({ sentAt: Date.now() }),
      undo: () => {
        const t = get().toast;
        if (t) get().dec(t.id);
        set({ toast: null });
      },
      hideToast: () => set({ toast: null }),
    }),
    {
      name: 'cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated in <CartHydrator/> after mount so server and first client render match.
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines, mode: s.mode, form: s.form, sentAt: s.sentAt }),
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty * l.price, 0);
