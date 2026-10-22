'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CloseIcon } from '@/components/ui/icons';

/** One line on the accent colour. Dismissal collapses it and is remembered for the session. */
export function PromoBanner({ text, link }: { text: string; link?: string }) {
  const key = `promo:${text}`;
  const [shown, setShown] = useState(true);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(key)) setShown(false);
    } catch {}
  }, [key]);
  if (!shown) return null;
  const close = () => {
    setShown(false);
    try {
      sessionStorage.setItem(key, '1');
    } catch {}
  };
  const body = <span className="min-w-0">{text}</span>;
  return (
    <div className="relative z-50 flex items-center justify-between gap-3 bg-accent px-5 py-2.5 text-[12px] leading-snug text-ink lg:justify-center lg:px-12 lg:text-[13px]">
      {link ? (
        <Link href={link} className="hover:opacity-80">
          {body}
        </Link>
      ) : (
        body
      )}
      <button type="button" onClick={close} aria-label="Dismiss" className="-m-1 shrink-0 p-1 lg:absolute lg:right-10">
        <CloseIcon width={16} height={16} />
      </button>
    </div>
  );
}
