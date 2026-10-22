'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cartCount, useCart } from '@/components/cart/store';
import { useHydrated } from '@/components/cart/CartHydrator';
import { buttonClass } from '@/components/ui/Button';
import type { Site } from '@/lib/site';
import { MobileMenu } from './MobileMenu';

/** Sticky header. Transparent over the home hero, solid after scroll; solid everywhere else. */
export function Header({ site }: { site: Site }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isConcept = site.concepts.some((c) => pathname === `/${c.slug}`);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [isHome]);

  useEffect(() => setMenu(false), [pathname]);

  const overlay = isHome && !scrolled;
  const f = site.features;

  return (
    <>
      <header
        className={[
          'sticky top-0 z-40 border-b transition-[background-color,color,border-color] duration-300',
          isHome ? '-mb-[60px] lg:-mb-[76px]' : '',
          overlay ? 'border-transparent bg-transparent text-paper' : 'border-line bg-bg text-text',
        ].join(' ')}
      >
        {/* Mobile */}
        <div className="flex h-[60px] items-center justify-between px-5 lg:hidden">
          <button type="button" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} className="-m-2 flex w-[38px] flex-col gap-[5px] p-2">
            <span className="h-[1.5px] w-[22px] bg-current" />
            <span className="h-[1.5px] w-[14px] bg-current" />
          </button>
          <Link href="/" className={`display text-[22px] tracking-[-0.01em] ${isHome ? 'brand-fade' : ''}`}>
            {site.brand}
          </Link>
          {f.cart ? <CartIcon /> : <span className="w-[22px]" />}
        </div>

        {/* Desktop */}
        <div className="hidden h-[76px] grid-cols-[1fr_auto_1fr] items-center px-12 lg:grid">
          <nav className="label flex gap-7 text-[13px]" aria-label="Kitchens">
            {isConcept ? (
              <Link href="/">← All kitchens</Link>
            ) : (
              site.concepts.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="hover:opacity-75" aria-current={pathname === `/${c.slug}` ? 'page' : undefined}>
                  {c.name}
                </Link>
              ))
            )}
          </nav>
          <Link href="/" className="display text-[28px] tracking-[-0.01em]">
            {site.brand}
          </Link>
          <div className="flex items-center justify-end gap-6 text-[14px]">
            {!isConcept && (
              <>
                <Link href="/visit" className="hover:opacity-75">
                  Visit
                </Link>
                {f.events && (
                  <Link href="/events" className="hover:opacity-75">
                    Events
                  </Link>
                )}
              </>
            )}
            {f.reserve && (
              <Link href="/reserve" className={buttonClass('primary', 'md', '!h-[42px] !px-5')}>
                Save me a seat
              </Link>
            )}
            {f.cart && <CartPill />}
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} site={site} />
    </>
  );
}

function useCountBounce(count: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(count);
  const hydrated = useHydrated();
  useEffect(() => {
    if (hydrated && count > prev.current) {
      ref.current?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'ease-out' });
    }
    prev.current = count;
  }, [count, hydrated]);
  return ref;
}

function CartIcon() {
  const hydrated = useHydrated();
  const count = useCart((s) => (hydrated ? cartCount(s.lines) : 0));
  const setOpen = useCart((s) => s.setOpen);
  const bounce = useCountBounce(count);
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label={`Open order, ${count} items`} className="relative -m-2 p-2" data-cart-target>
      <span className="block h-5 w-[22px] rounded-[2px_2px_4px_4px] border-[1.5px] border-current" />
      {count > 0 && (
        <span
          ref={bounce}
          className="absolute top-[-1px] right-[-2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink"
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CartPill() {
  const hydrated = useHydrated();
  const count = useCart((s) => (hydrated ? cartCount(s.lines) : 0));
  const setOpen = useCart((s) => s.setOpen);
  const bounce = useCountBounce(count);
  return (
    <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 font-semibold" aria-label={`Open order, ${count} items`}>
      Cart
      <span
        ref={bounce}
        data-cart-target
        className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-full border px-1.5 text-[12px] ${count ? 'border-accent bg-accent text-ink' : 'border-current'}`}
      >
        {count}
      </span>
    </button>
  );
}
