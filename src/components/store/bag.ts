'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { lineKey, MAX_QTY, type BagLine, type BagMode } from '@/lib/store';
import type { Fulfilment } from '@/lib/whatsapp';

type Message = { title: string; text: string };

type BagState = {
  lines: BagLine[];
  /** Retail / Wholesale toggle; remembered across products and visits. */
  mode: BagMode;
  fulfilment: Fulfilment;
  form: { name: string; phone: string; address: string; note: string };
  /** Set after "Send order on WhatsApp"; shows "Order sent? Clear bag". */
  sentAt: number | null;
  open: boolean;
  /** When set, the sheet shows this WhatsApp message preview instead of the bag. */
  message: Message | null;
  toast: { text: string; key: number } | null;
  add: (line: Omit<BagLine, 'key'>, toast: string) => void;
  step: (key: string, delta: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  showMessage: (m: Message) => void;
  setMode: (mode: BagMode) => void;
  setFulfilment: (f: Fulfilment) => void;
  setField: (k: keyof BagState['form'], v: string) => void;
  markSent: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useBag = create<BagState>()(
  persist(
    (set, get) => ({
      lines: [],
      mode: 'retail',
      fulfilment: 'pickup',
      form: { name: '', phone: '', address: '', note: '' },
      sentAt: null,
      open: false,
      message: null,
      toast: null,
      add: (line, toast) => {
        const key = lineKey(line);
        const lines = get().lines;
        const hit = lines.find((l) => l.key === key);
        const cap = (n: number) => Math.min(MAX_QTY[line.mode], n);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => set({ toast: null }), 1800);
        set({
          lines: hit ? lines.map((l) => (l.key === key ? { ...l, ...line, qty: cap(l.qty + line.qty) } : l)) : [...lines, { ...line, key, qty: cap(line.qty) }],
          toast: { text: toast, key: Date.now() },
          sentAt: null,
        });
      },
      step: (key, delta) =>
        set((s) => ({
          lines: s.lines.flatMap((l) => (l.key !== key ? [l] : l.qty + delta > 0 ? [{ ...l, qty: Math.min(MAX_QTY[l.mode], l.qty + delta) }] : [])),
          sentAt: null,
        })),
      clear: () => set({ lines: [], sentAt: null, form: { ...get().form, note: '' } }),
      setOpen: (open) => set({ open, message: null, toast: open ? null : get().toast }),
      showMessage: (message) => set({ open: true, message, toast: null }),
      setMode: (mode) => set({ mode }),
      setFulfilment: (fulfilment) => set({ fulfilment }),
      setField: (k, v) => set((s) => ({ form: { ...s.form, [k]: v } })),
      markSent: () => set({ sentAt: Date.now() }),
    }),
    {
      name: 'bag',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated in <BagHydrator/> after mount so server and first client render match.
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines, mode: s.mode, fulfilment: s.fulfilment, form: s.form, sentAt: s.sentAt }),
    },
  ),
);
