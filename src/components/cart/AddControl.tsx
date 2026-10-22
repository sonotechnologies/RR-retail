'use client';

import type { MouseEvent } from 'react';
import { flyToCart } from '@/components/motion/fly';
import { useCart, type CartProduct } from './store';
import { useHydrated } from './CartHydrator';

type Props = {
  product: CartProduct;
  available?: boolean;
  /** "dish": + circle on mobile, "Add +" pill on desktop. "row": same, with "n in cart" on desktop. */
  kind?: 'dish' | 'row';
};

/** Add button that becomes a quantity stepper once the item is in the cart. Flies the
 *  nearest [data-fly] image to the cart on desktop. */
export function AddControl({ product, available = true, kind = 'dish' }: Props) {
  const hydrated = useHydrated();
  const qty = useCart((s) => s.lines.find((l) => l.id === product.id)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const dec = useCart((s) => s.dec);

  if (!available) {
    return <span className="flex h-11 items-center text-[12px] text-muted lg:h-auto lg:text-[13px]">Back tomorrow</span>;
  }

  const onAdd = (e: MouseEvent<HTMLElement>) => {
    if (qty === 0) flyToCart(e.currentTarget.closest('[data-dish]')?.querySelector<HTMLElement>('[data-fly]'));
    add(product);
  };

  if (!hydrated || qty === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add ${product.name} to order`}
        className="group/add flex shrink-0 items-center justify-center rounded-full border border-text font-semibold transition-[transform,background-color,color] duration-200 hover:bg-text hover:text-bg active:scale-95 max-lg:size-11 max-lg:text-[20px] lg:h-[42px] lg:px-[18px] lg:text-[14px] data-[row]:lg:h-[38px] data-[row]:lg:px-4 data-[row]:lg:text-[13px]"
        data-row={kind === 'row' ? '' : undefined}
      >
        <span className="lg:hidden">+</span>
        <span className="hidden lg:inline">Add +</span>
      </button>
    );
  }

  return (
    <span className="flex h-11 shrink-0 items-center rounded-full bg-text text-bg lg:h-[42px] data-[row]:lg:h-[38px]" data-row={kind === 'row' ? '' : undefined}>
      <button type="button" onClick={() => dec(product.id)} aria-label={`Remove one ${product.name}`} className="h-full w-8 text-[18px] lg:w-9">
        −
      </button>
      <span className="min-w-3.5 text-center text-[14px] font-bold" aria-live="polite">
        {qty}
        {kind === 'row' && <span className="hidden lg:inline"> in cart</span>}
      </span>
      <button type="button" onClick={onAdd} aria-label={`Add another ${product.name}`} className="h-full w-8 text-[18px] lg:w-9">
        +
      </button>
    </span>
  );
}
