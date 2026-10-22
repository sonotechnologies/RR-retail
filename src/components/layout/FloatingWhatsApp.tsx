'use client';

import { useCart } from '@/components/cart/store';
import { useBag } from '@/components/store/bag';
import { ChatIcon } from '@/components/ui/icons';
import { waLink } from '@/lib/whatsapp';

/** Bottom-right on mobile, 16px inset; hides while the cart / bag sheet is open.
 *  Store mode sits above the bottom tab bar and also shows on desktop. */
export function FloatingWhatsApp({ number, greeting, store = false }: { number: string; greeting: string; store?: boolean }) {
  const cartOpen = useCart((s) => s.open);
  const bagOpen = useBag((s) => s.open);
  const open = store ? bagOpen : cartOpen;
  return (
    <a
      href={waLink(number, `Hi ${greeting}, `)}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className={`fixed z-30 flex items-center justify-center rounded-full bg-wa text-wa-ink transition-[opacity,transform] duration-300 ${
        store
          ? 'right-3.5 bottom-[calc(84px+env(safe-area-inset-bottom))] size-[54px] shadow-[0_6px_20px_rgba(0,0,0,.45)] lg:right-7 lg:bottom-7 lg:size-[60px]'
          : 'right-4 bottom-5 size-14 shadow-[0_8px_20px_-6px_#0006] lg:hidden'
      } ${open ? 'pointer-events-none scale-75 opacity-0' : ''}`}
    >
      <ChatIcon width={26} height={26} />
    </a>
  );
}
