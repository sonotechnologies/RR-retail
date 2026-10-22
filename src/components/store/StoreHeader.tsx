'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BagIcon, SearchIcon } from '@/components/ui/icons';
import type { StoreSite } from '@/lib/storeSite';
import { waLink } from '@/lib/whatsapp';
import { useBag } from './bag';
import { LogoTile } from './Logo';
import { useBagCount } from './useBagCount';

/** Sticky header: logo, search and bag on mobile; logo, category nav, WhatsApp pill and bag on desktop. */
export function StoreHeader({ site }: { site: StoreSite }) {
  const pathname = usePathname();
  const nav = [
    ...site.categories.filter((c) => !c.bundles).map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
    ...(site.wholesale.enabled ? [{ href: '/wholesale', label: 'Wholesale' }] : []),
    ...(site.pickup ? [{ href: '/pickup', label: 'Pickup' }] : []),
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-[8px]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-10 px-4 py-2.5 lg:justify-start lg:px-12 lg:py-3.5">
        <Link href="/" className="flex items-center gap-2.5 lg:gap-3" aria-label={`${site.brand} home`}>
          <span className="lg:hidden">
            <LogoTile site={site} size={36} />
          </span>
          <span className="hidden lg:block">
            <LogoTile site={site} size={44} />
          </span>
          <span className="flex flex-col leading-[1.1]">
            <span className="display text-[18px] whitespace-nowrap lg:text-[22px]">{site.brand}</span>
            <span className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase lg:hidden">{site.locationLine}</span>
          </span>
        </Link>

        <nav aria-label="Shop" className="no-scrollbar hidden min-w-0 flex-1 gap-6 overflow-x-auto text-[14px] font-bold whitespace-nowrap lg:flex">
          {nav.map((n) => {
            const on = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link key={n.href} href={n.href} aria-current={on ? 'page' : undefined} className={`transition-colors hover:text-accent ${on ? 'text-accent' : ''}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 lg:gap-2">
          <a
            href={waLink(site.whatsapp)}
            target="_blank"
            rel="noopener"
            className="mr-1 hidden h-10 items-center gap-2 rounded-full border border-wa px-4 text-[13px] font-bold whitespace-nowrap transition-colors hover:bg-wa hover:text-wa-ink lg:flex"
          >
            <span className="size-2 rounded-full bg-wa" />
            {site.phone}
          </a>
          <Link href="/shop#search" aria-label="Search" className="flex size-11 items-center justify-center">
            <SearchIcon width={22} height={22} />
          </Link>
          <BagButton />
        </div>
      </div>
    </header>
  );
}

function BagButton() {
  const { count, ref } = useBagCount();
  const setOpen = useBag((s) => s.setOpen);
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label={`Open bag, ${count} items`} className="relative flex size-11 items-center justify-center" data-cart-target>
      <BagIcon width={22} height={22} className="lg:size-6" />
      {count > 0 && (
        <span ref={ref} className="absolute top-[5px] right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-extrabold text-ink">
          {count}
        </span>
      )}
    </button>
  );
}
