'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SearchIcon } from '@/components/ui/icons';
import { allSizes, filterProducts, NO_FILTERS, PRICE_BANDS, type ShopFilters, type StoreProduct } from '@/lib/store';
import { Chip, ChipLink } from './Chip';
import { ProductCard } from './ProductCard';
import { useStoreSite } from './StoreSiteContext';

type Props = {
  products: StoreProduct[];
  /** null = all items. */
  category: { slug: string; name: string; bundles: boolean } | null;
  /** Under the title ("· bundles of 20–30 pieces"). */
  countNote?: string;
};

/** Category page: title, item count, category chips, filters (size, price, in stock), sort, 2-column grid. */
export function ShopView({ products, category, countNote }: Props) {
  const site = useStoreSite();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [f, setF] = useState<ShopFilters>({ ...NO_FILTERS, q: params.get('q') ?? '' });
  const search = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<ShopFilters>) => setF((s) => ({ ...s, ...patch }));

  // Search lives in ?q= so it can be shared and survives back/forward.
  useEffect(() => {
    const q = f.q.trim();
    if ((params.get('q') ?? '') === q) return;
    const t = setTimeout(() => router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false }), 250);
    return () => clearTimeout(t);
  }, [f.q, params, pathname, router]);

  // Header search icon links to /shop#search.
  useEffect(() => {
    const focus = () => location.hash === '#search' && search.current?.focus();
    focus();
    window.addEventListener('hashchange', focus);
    return () => window.removeEventListener('hashchange', focus);
  }, []);

  const names = useMemo(() => Object.fromEntries(site.categories.map((c) => [c.slug, c.name])), [site.categories]);
  const sizes = useMemo(() => allSizes(products), [products]);
  const list = filterProducts(products, f, names);
  const filtered = f.q || f.size || f.band || f.inStock;
  const title = category ? (category.bundles ? 'Wholesale bundles' : category.name) : 'All items';
  const count = `${list.length} ${list.length === 1 ? 'item' : 'items'}${countNote ?? ''}`;

  return (
    <div className="mx-auto max-w-[1440px] lg:px-12 lg:pt-10">
      <div className="flex flex-col gap-3.5 px-4 pt-[18px] lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-5 lg:px-0 lg:pt-0">
        <div>
          <p className="mb-1.5 hidden text-[13px] font-semibold text-muted lg:block">
            <Link href="/" className="hover:text-text">
              Home
            </Link>{' '}
            / {title}
          </p>
          <h1 className="display text-[34px] leading-[1.05] lg:text-[60px] lg:leading-none">{title}</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-muted lg:mt-1.5 lg:text-[15px]">{count}</p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex items-center lg:w-[260px]">
            <span className="sr-only">Search the shop</span>
            <SearchIcon width={18} height={18} className="pointer-events-none absolute left-3.5 text-muted" />
            <input
              ref={search}
              id="search"
              type="search"
              value={f.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="Search tops, jeans, polos…"
              enterKeyHint="search"
              className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-10 text-[16px] outline-none placeholder:text-muted focus:border-accent lg:h-10 lg:text-[14px]"
            />
          </label>
          <div role="radiogroup" aria-label="Sort" className="hidden rounded-full border border-line bg-surface p-1 lg:flex">
            {(
              [
                ['newest', 'Newest'],
                ['price', 'Price low–high'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={f.sort === k}
                onClick={() => set({ sort: k })}
                className={`h-[38px] rounded-full px-4 text-[13px] font-extrabold transition-colors ${f.sort === k ? 'bg-accent text-ink' : 'text-muted hover:text-text'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav aria-label="Categories" className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3.5 pb-1 lg:flex-wrap lg:px-0 lg:pt-[26px] lg:pb-3.5">
        <ChipLink href="/shop" on={!category}>
          All
        </ChipLink>
        {site.categories.map((c) => (
          <ChipLink key={c.slug} href={`/shop/${c.slug}`} on={category?.slug === c.slug}>
            {c.name}
          </ChipLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1.5 border-line pb-4 lg:mb-7 lg:flex-row lg:flex-wrap lg:items-center lg:gap-2 lg:border-b lg:pb-7">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 pt-1.5 lg:order-2 lg:overflow-visible lg:p-0">
          <span className="mx-2 hidden h-6 w-px bg-line lg:block" />
          <Chip size="sm" on={false} onClick={() => set({ sort: f.sort === 'newest' ? 'price' : 'newest' })} className="lg:hidden">
            Sort: {f.sort === 'newest' ? 'Newest' : 'Price low–high'}
          </Chip>
          <Chip size="sm" on={f.inStock} onClick={() => set({ inStock: !f.inStock })}>
            {f.inStock ? '✓ In stock' : 'In stock'}
          </Chip>
          {PRICE_BANDS.map((b) => (
            <Chip key={b.id} size="sm" on={f.band === b.id} onClick={() => set({ band: f.band === b.id ? null : b.id })}>
              {f.band === b.id ? `✓ ${b.label}` : b.label}
            </Chip>
          ))}
        </div>
        {sizes.length > 0 && (
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 pt-1 lg:order-1 lg:flex-wrap lg:p-0" role="group" aria-label="Size">
            <span className="mr-1 shrink-0 text-[12px] font-bold text-muted lg:text-[13px]">Size</span>
            {sizes.map((s) => (
              <Chip key={s} size="sm" on={f.size === s} onClick={() => set({ size: f.size === s ? null : s })} className="min-w-11">
                {s}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 lg:px-0">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center text-[14px] text-muted lg:py-[60px] lg:text-[16px]">
            {products.length ? 'Nothing matches. Try removing a filter.' : 'New stock is on the way. Ask us on WhatsApp what just landed.'}
            {filtered && (
              <button type="button" onClick={() => setF({ ...NO_FILTERS, sort: f.sort })} className="font-bold text-text underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:gap-x-[18px] lg:gap-y-8">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} bundles={!!category?.bundles} showMin priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
