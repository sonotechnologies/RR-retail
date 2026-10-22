'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';
import { BagIcon, BoxIcon, GridIcon, HomeIcon, PinIcon } from '@/components/ui/icons';
import type { StoreSite } from '@/lib/storeSite';
import { useBag } from './bag';
import { useBagCount } from './useBagCount';

type Tab = { href: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

/** Mobile bottom tab bar: Home, Shop, Wholesale, Pickup, Bag (with count). */
export function TabBar({ site }: { site: StoreSite }) {
  const pathname = usePathname();
  const bagOpen = useBag((s) => s.open && !s.message);
  const setOpen = useBag((s) => s.setOpen);
  const { count, ref } = useBagCount();
  const tabs: Tab[] = [
    { href: '/', label: 'Home', Icon: HomeIcon },
    { href: '/shop', label: 'Shop', Icon: GridIcon },
    ...(site.wholesale.enabled ? [{ href: '/wholesale', label: 'Wholesale', Icon: BoxIcon }] : []),
    ...(site.pickup ? [{ href: '/pickup', label: 'Pickup', Icon: PinIcon }] : []),
  ];
  const active = (href: string) => !bagOpen && (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`) || (href === '/shop' && pathname.startsWith('/p/')));
  const cell = 'relative flex flex-col items-center justify-center gap-[3px] text-[11px] font-bold transition-colors';

  return (
    <nav
      aria-label="Store"
      className="fixed inset-x-0 bottom-0 z-[45] grid border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden"
      style={{ gridTemplateColumns: `repeat(${tabs.length + 1}, minmax(0, 1fr))` }}
    >
      {tabs.map(({ href, label, Icon }) => (
        <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} className={`${cell} h-[72px] pb-1.5 ${active(href) ? 'text-accent' : 'text-muted'}`}>
          <Icon width={22} height={22} />
          {label}
        </Link>
      ))}
      <button type="button" onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`} className={`${cell} h-[72px] pb-1.5 ${bagOpen ? 'text-accent' : 'text-muted'}`}>
        <BagIcon width={22} height={22} />
        Bag
        {count > 0 && (
          <span ref={ref} className="absolute top-2 left-[calc(50%+6px)] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-ink">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}
