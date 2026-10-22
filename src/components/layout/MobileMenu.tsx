'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';
import type { Site } from '@/lib/site';

/** Full-screen overlay with big serif links. */
export function MobileMenu({ open, onClose, site }: { open: boolean; onClose: () => void; site: Site }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', esc);
    };
  }, [open, onClose]);

  const f = site.features;
  const secondary = [
    f.cakes && { href: '/cakes', label: 'Cakes' },
    f.events && { href: '/events', label: 'Events' },
    { href: '/visit', label: 'Visit' },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-50 flex flex-col bg-text px-5 pt-5 pb-8 text-bg outline-none transition-[opacity,transform] duration-300 ease-out-expo lg:hidden ${
        open ? 'opacity-100' : 'pointer-events-none translate-y-[-8px] opacity-0'
      }`}
    >
      <div className="flex items-center justify-between pb-6">
        <Link href="/" onClick={onClose} className="display text-[22px]">
          {site.brand}
        </Link>
        <button type="button" onClick={onClose} aria-label="Close menu" className="-m-2 p-2">
          <CloseIcon />
        </button>
      </div>
      <nav className="flex flex-col gap-1.5">
        {site.concepts.map((c) => (
          <Link key={c.slug} href={`/${c.slug}`} onClick={onClose} className="display flex items-baseline gap-3 text-[40px] leading-[1.15]">
            <span className="font-sans text-[12px] font-bold tracking-[0.12em]" style={{ color: c.tint }}>
              {c.number}
            </span>
            {c.shortName}
          </Link>
        ))}
        <div className="mt-4 flex flex-col gap-1.5">
          {secondary.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose} className="display text-[40px] leading-[1.15] opacity-50">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      {f.reserve && (
        <Link href="/reserve" onClick={onClose} className={buttonClass('primary', 'lg', 'mt-auto w-full')}>
          Save me a seat
        </Link>
      )}
    </div>
  );
}
