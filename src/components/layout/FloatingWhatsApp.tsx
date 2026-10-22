'use client';

import { useCart } from '@/components/cart/store';
import { ChatIcon } from '@/components/ui/icons';
import { waLink } from '@/lib/whatsapp';

/** Bottom-right on mobile, 16px inset; hides while the cart sheet is open. */
export function FloatingWhatsApp({ number, brand }: { number: string; brand: string }) {
  const open = useCart((s) => s.open);
  return (
    <a
      href={waLink(number, `Hi ${brand}, `)}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 bottom-5 z-30 flex size-14 items-center justify-center rounded-full bg-wa text-wa-ink shadow-[0_8px_20px_-6px_#0006] transition-[opacity,transform] duration-300 lg:hidden ${
        open ? 'pointer-events-none scale-75 opacity-0' : ''
      }`}
    >
      <ChatIcon width={26} height={26} />
    </a>
  );
}
