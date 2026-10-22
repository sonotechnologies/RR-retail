'use client';

import Link from 'next/link';
import { useState, type MouseEvent } from 'react';
import { flyToCart } from '@/components/motion/fly';
import { formatNaira } from '@/lib/format';
import { MAX_QTY, MIXED, ONE_SIZE, type BagMode, type StoreProduct } from '@/lib/store';
import { buildProductQuestion, productUrl } from '@/lib/whatsapp';
import { useBag } from './bag';
import { useBagHydrated } from './BagHydrator';
import { Badge } from './Badge';
import { Gallery } from './Gallery';
import { ModeToggle } from './ModeToggle';
import { useStoreSite } from './StoreSiteContext';

/** Product page: gallery, price block, mode toggle, colour + size chips, qty stepper, add to bag, ask on WhatsApp. */
export function ProductView({ product: p }: { product: StoreProduct }) {
  const site = useStoreSite();
  const hydrated = useBagHydrated();
  const savedMode = useBag((s) => s.mode);
  const { setMode, add, showMessage } = useBag.getState();
  const canWholesale = site.wholesale.enabled && !!p.wholesalePrice;
  // Server render and first paint are retail; the remembered choice applies after hydration.
  const mode: BagMode = canWholesale && hydrated ? savedMode : 'retail';
  const ws = mode === 'wholesale';

  const [picked, setPicked] = useState<{ size: string | null; colour: string | null }>({ size: null, colour: null });
  const [qty, setQty] = useState(1);
  const [needSize, setNeedSize] = useState(false);

  const oneSize = p.sizes.length === 0;
  const size = picked.size ?? (ws ? MIXED : oneSize ? ONE_SIZE : p.sizes.length === 1 && !p.soldOutSizes.includes(p.sizes[0]) ? p.sizes[0] : null);
  const colour = picked.colour ?? (ws && p.colours.length > 1 ? MIXED : (p.colours[0]?.name ?? ''));
  const unit = ws ? p.wholesalePrice! : p.retailPrice;
  const pieces = ws ? qty * p.wholesaleMin : qty;
  const total = pieces * unit;
  const max = MAX_QTY[mode];

  const switchMode = (m: BagMode) => {
    setMode(m);
    setQty(1);
    setPicked({ size: null, colour: null });
    setNeedSize(false);
  };

  const onAdd = (e: MouseEvent<HTMLButtonElement>) => {
    if (!size) return setNeedSize(true);
    flyToCart(document.querySelector<HTMLElement>('[data-gallery-main]'));
    add({ slug: p.slug, name: p.name, image: p.images[0], mode, size, colour, qty, unitPrice: unit, min: ws ? p.wholesaleMin : 1 }, site.copy.addedToast);
    e.currentTarget.blur();
  };

  const ask = () =>
    showMessage({
      title: 'Ask on WhatsApp',
      text: buildProductQuestion({
        shortName: site.shortName,
        name: p.name,
        url: productUrl(site.siteUrl, p.slug),
        mode,
        inStock: p.inStock,
        size,
        colour,
        wholesalePrice: p.wholesalePrice,
        wholesaleMin: p.wholesaleMin,
      }),
    });

  const chip = (on: boolean, out = false) =>
    `h-11 min-w-[52px] rounded-full border px-3.5 text-[14px] font-extrabold transition-colors ${
      on ? 'border-text bg-text text-bg' : out ? 'border-line text-soldout line-through' : 'border-line hover:border-text'
    }`;

  return (
    <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 lg:px-12 lg:pt-10">
      <div data-gallery-main>
        <Gallery images={p.images} name={p.name} />
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4 lg:gap-5 lg:px-0 lg:pt-0">
        <div className="flex flex-col gap-1.5">
          <p className="hidden text-[13px] font-semibold text-muted lg:block">
            <Link href="/shop" className="hover:text-text">
              Shop
            </Link>{' '}
            / {site.categories.find((c) => c.slug === p.category)?.name}
          </p>
          {p.badge && <Badge name={p.badge} className="self-start !px-2.5 !text-[11px]" />}
          <h1 className="display text-[30px] leading-[1.05] lg:text-[48px]">{p.name}</h1>
        </div>

        {canWholesale && <ModeToggle mode={mode} onChange={switchMode} />}

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[38px] leading-none font-extrabold tracking-[-0.02em] lg:text-[44px]">{formatNaira(unit)}</span>
            {ws && <span className="text-[15px] font-bold text-muted">/ piece</span>}
          </div>
          {canWholesale && (
            <p className="text-[14px] font-bold text-accent-text">
              {ws
                ? `Bundle of ${p.wholesaleMin} pcs = ${formatNaira(p.wholesalePrice! * p.wholesaleMin)} · Retail ${formatNaira(p.retailPrice)}`
                : `Wholesale ${formatNaira(p.wholesalePrice!)}/pc · min ${p.wholesaleMin} pcs`}
            </p>
          )}
          {canWholesale && site.wholesale.sampleNote && <p className="text-[12px] text-muted">{site.wholesale.sampleNote}</p>}
        </div>

        {p.colours.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-bold text-muted">
              Colour · <span className="text-text">{colour === MIXED ? 'Mixed colours' : colour}</span>
            </p>
            <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-2.5">
              {p.colours.map((c) =>
                c.hex ? (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={colour === c.name}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setPicked((s) => ({ ...s, colour: c.name }))}
                    className="size-11 rounded-full border-2 border-bg transition-shadow"
                    style={{ background: c.hex, boxShadow: `0 0 0 2px ${colour === c.name ? 'var(--accent)' : 'var(--line)'}` }}
                  />
                ) : (
                  <button key={c.name} type="button" role="radio" aria-checked={colour === c.name} onClick={() => setPicked((s) => ({ ...s, colour: c.name }))} className={chip(colour === c.name)}>
                    {c.name}
                  </button>
                ),
              )}
              {ws && p.colours.length > 1 && (
                <button type="button" role="radio" aria-checked={colour === MIXED} onClick={() => setPicked((s) => ({ ...s, colour: MIXED }))} className={chip(colour === MIXED)}>
                  Mixed
                </button>
              )}
            </div>
          </div>
        )}

        {!oneSize && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-bold text-muted">Size</p>
            <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
              {ws && (
                <button type="button" role="radio" aria-checked={size === MIXED} onClick={() => setPicked((s) => ({ ...s, size: MIXED }))} className={chip(size === MIXED)}>
                  Mixed
                </button>
              )}
              {p.sizes.map((z) => {
                const out = p.soldOutSizes.includes(z);
                return (
                  <button
                    key={z}
                    type="button"
                    role="radio"
                    aria-checked={size === z}
                    aria-disabled={out || undefined}
                    aria-label={out ? `${z}, sold out` : z}
                    onClick={() => {
                      if (out) return;
                      setPicked((s) => ({ ...s, size: z }));
                      setNeedSize(false);
                    }}
                    className={`${chip(size === z, out)} ${out ? 'cursor-not-allowed' : ''}`}
                  >
                    {z}
                  </button>
                );
              })}
            </div>
            {ws && (
              <p className="text-[13px] text-muted">
                Want different items in one order?{' '}
                <Link href="/wholesale#mix" className="font-bold text-accent-text">
                  Request a custom mix
                </Link>
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center rounded-full border border-line bg-surface">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label="Fewer" className="size-11 text-[20px] disabled:text-soldout">
              −
            </button>
            <span className="min-w-[34px] text-center text-[16px] font-extrabold" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty(Math.min(max, qty + 1))} disabled={qty >= max} aria-label="More" className="size-11 text-[20px] disabled:text-soldout">
              +
            </button>
          </span>
          <span className="flex flex-col text-right">
            <span className="text-[12px] font-semibold text-muted">
              {ws ? `${qty} ${qty === 1 ? 'bundle' : 'bundles'} = ${pieces} pieces` : `${qty} ${qty === 1 ? 'piece' : 'pieces'}`}
            </span>
            <span className="text-[20px] font-extrabold">{formatNaira(total)}</span>
          </span>
        </div>

        {needSize && <p className="-mt-1.5 text-[13px] font-bold text-sale">Pick a size first.</p>}

        <div className="flex flex-col gap-2.5">
          {p.inStock ? (
            <button type="button" onClick={onAdd} className="h-[54px] rounded-full bg-accent text-[16px] font-extrabold text-ink transition-[transform,filter] hover:brightness-[1.08] active:scale-[0.98]">
              Add to bag · {formatNaira(total)}
            </button>
          ) : (
            <button type="button" disabled className="h-[54px] cursor-not-allowed rounded-full bg-soldout text-[16px] font-extrabold text-text">
              Sold out
            </button>
          )}
          <button
            type="button"
            onClick={ask}
            className="flex h-[50px] items-center justify-center gap-2 rounded-full border border-wa text-[15px] font-bold transition-colors hover:bg-wa hover:text-wa-ink"
          >
            <span className="size-2.5 rounded-full bg-wa" />
            {p.inStock ? 'Ask on WhatsApp' : 'Ask when it’s restocking'}
          </button>
        </div>

        {p.description && <p className="text-[15px] leading-relaxed text-muted">{p.description}</p>}
      </div>
    </div>
  );
}
