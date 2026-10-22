'use client';

import Link from 'next/link';
import { useState, type MouseEvent } from 'react';
import { flyToCart } from '@/components/motion/fly';
import { Photo } from '@/components/ui/Photo';
import { formatNaira } from '@/lib/format';
import { MIXED, ONE_SIZE, type StoreProduct } from '@/lib/store';
import { useBag } from './bag';
import { useBagHydrated } from './BagHydrator';
import { Badge } from './Badge';
import { useStoreSite } from './StoreSiteContext';

type Props = {
  product: StoreProduct;
  /** "row": 140px tile in the mobile "Just restocked" scroller. */
  variant?: 'grid' | 'row';
  /** Bundles category: quick add puts in one mixed bundle; the card shows the bundle minimum. */
  bundles?: boolean;
  /** Show "· min N" after the wholesale price (category pages on desktop). */
  showMin?: boolean;
  priority?: boolean;
};

const TINT = '#1B1917';

/** 4:5 photo, name (one line), retail price large, "Wholesale from ₦X" small, badge.
 *  States: default, sold out (greyed), added ("In bag"). Desktop: second photo + zoom on hover, quick add. */
export function ProductCard({ product: p, variant = 'grid', bundles = false, showMin = false, priority = false }: Props) {
  const href = `/p/${p.slug}`;
  const row = variant === 'row';
  const dim = !p.inStock;
  return (
    <div className={`group flex min-w-0 flex-col gap-1 lg:gap-[5px] ${row ? 'w-[140px] shrink-0 snap-start lg:w-auto' : ''}`} data-dish>
      <div className="relative mb-1 aspect-[4/5] overflow-hidden rounded-card bg-surface lg:mb-1.5" data-fly>
        <Link href={href} className="absolute inset-0" aria-label={p.name} tabIndex={-1}>
          {p.images[0] && (
            <Photo
              src={p.images[0]}
              alt={p.name}
              tint={TINT}
              priority={priority}
              sizes={row ? '(min-width:1024px) 260px, 140px' : '(min-width:1024px) 300px, 50vw'}
              className="transition-transform duration-500 ease-out lg:group-hover:scale-105"
            />
          )}
          {/* Second photo on hover (desktop only; display:none keeps phones from downloading it). */}
          {p.images[1] && (
            <span className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 lg:block lg:group-hover:opacity-100">
              <Photo src={p.images[1]} alt="" tint={TINT} sizes="300px" className="scale-100 transition-transform duration-500 lg:group-hover:scale-105" />
            </span>
          )}
        </Link>
        {p.badge && p.badge !== 'Sold out' && <Badge name={p.badge} className="pointer-events-none absolute top-2 left-2 lg:top-2.5 lg:left-2.5" />}
        {dim && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/65">
            <span className="rounded-full bg-soldout px-3 py-[5px] text-[11px] font-extrabold lg:px-3.5 lg:py-1.5 lg:text-[12px]">Sold out</span>
          </div>
        )}
        <InBag slug={p.slug} />
        {!dim && <QuickAdd product={p} bundles={bundles} />}
      </div>
      <Link href={href} className="flex min-w-0 flex-col gap-1 lg:gap-[5px]">
        <span className={`truncate text-[13px] font-semibold lg:text-[15px] ${dim ? 'text-muted' : ''}`}>{p.name}</span>
        <span className={`-mt-1 font-extrabold lg:mt-0 lg:text-[22px] ${row ? 'text-[17px]' : 'text-[18px]'} ${dim ? 'text-muted' : ''}`}>{formatNaira(p.retailPrice)}</span>
        {p.wholesalePrice && !row && (
          <span className="text-[11px] font-semibold text-accent-text lg:text-[13px]">
            Wholesale from {formatNaira(p.wholesalePrice)}
            {showMin && <span className="hidden lg:inline"> · min {p.wholesaleMin}</span>}
          </span>
        )}
      </Link>
    </div>
  );
}

function InBag({ slug }: { slug: string }) {
  const hydrated = useBagHydrated();
  const inBag = useBag((s) => s.lines.some((l) => l.slug === slug));
  if (!hydrated || !inBag) return null;
  return <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-text px-2 py-[3px] text-[10px] font-extrabold text-bg lg:top-2.5 lg:right-2.5 lg:text-[11px]">In bag</span>;
}

/** Desktop "+ Add": one tap for one-size items and bundles; otherwise a size row over the photo. */
function QuickAdd({ product: p, bundles }: { product: StoreProduct; bundles: boolean }) {
  const site = useStoreSite();
  const add = useBag((s) => s.add);
  const [picking, setPicking] = useState(false);
  const wholesale = bundles && !!p.wholesalePrice;
  const colour = p.colours[0]?.name ?? '';

  const put = (e: MouseEvent<HTMLElement>, size: string) => {
    flyToCart(e.currentTarget.closest('[data-dish]')?.querySelector<HTMLElement>('[data-fly]'));
    add(
      wholesale
        ? { slug: p.slug, name: p.name, image: p.images[0], mode: 'wholesale', size: MIXED, colour: MIXED, qty: 1, unitPrice: p.wholesalePrice!, min: p.wholesaleMin }
        : { slug: p.slug, name: p.name, image: p.images[0], mode: 'retail', size, colour, qty: 1, unitPrice: p.retailPrice, min: 1 },
      site.copy.addedToast,
    );
    setPicking(false);
  };

  const onAdd = (e: MouseEvent<HTMLButtonElement>) => {
    if (wholesale || p.sizes.length <= 1) put(e, p.sizes[0] ?? ONE_SIZE);
    else setPicking(true);
  };

  const btn = 'h-[38px] rounded-full bg-text px-3.5 text-[13px] font-extrabold text-bg transition-colors hover:bg-accent hover:text-ink';
  if (picking) {
    return (
      <div className="absolute inset-x-2.5 bottom-2.5 hidden flex-col gap-2 rounded-card bg-bg/90 p-2.5 backdrop-blur-[6px] lg:flex" onMouseLeave={() => setPicking(false)}>
        <span className="text-[12px] font-bold text-muted">Pick a size</span>
        <div className="flex flex-wrap gap-1.5">
          {p.sizes.map((s) => {
            const out = p.soldOutSizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={out}
                onClick={(e) => put(e, s)}
                className="h-9 min-w-10 rounded-full border border-line px-2.5 text-[13px] font-extrabold hover:border-text disabled:text-soldout disabled:line-through"
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <button type="button" onClick={onAdd} className={`absolute right-2.5 bottom-2.5 hidden lg:block ${btn}`} aria-label={`Add ${p.name} to bag`}>
      {wholesale ? '+ Add bundle' : '+ Add'}
    </button>
  );
}
