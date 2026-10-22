'use client';

import { useBag } from './bag';

/** "Added! Your bag dey wait 🛍️": pill above the tab bar on mobile, bottom-centre on desktop. */
export function StoreToast() {
  const toast = useBag((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      key={toast.key}
      role="status"
      className="pointer-events-none fixed bottom-[150px] left-1/2 z-[55] -translate-x-1/2 rounded-full bg-text px-[18px] py-3 text-[14px] font-extrabold whitespace-nowrap text-bg shadow-[0_8px_24px_rgba(0,0,0,.4)] [animation:toast-in_250ms_ease-out_both] lg:bottom-10 lg:px-[22px] lg:py-3.5 lg:text-[15px]"
    >
      {toast.text}
    </div>
  );
}
