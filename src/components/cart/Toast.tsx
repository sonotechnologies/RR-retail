'use client';

import { useCart } from './store';

/** "Added · Chin-chin croissant" with Undo. Bottom on mobile (clear of the WhatsApp button), top-right on desktop. */
export function Toast() {
  const toast = useCart((s) => s.toast);
  const undo = useCart((s) => s.undo);
  if (!toast) return null;
  return (
    <div
      key={toast.key}
      role="status"
      className="fixed right-[84px] bottom-6 left-4 z-40 flex items-center justify-between gap-2.5 rounded-card bg-text px-4 py-3.5 text-[14px] text-bg shadow-[0_10px_30px_-12px_#0008] [animation:toast-in_400ms_var(--ease-out-expo)_both] lg:top-24 lg:right-8 lg:bottom-auto lg:left-auto lg:gap-5 lg:px-[18px]"
    >
      <span className="min-w-0 truncate">Added · {toast.name}</span>
      <button type="button" onClick={undo} className="shrink-0 font-bold underline">
        Undo
      </button>
    </div>
  );
}
