'use client';

import { AnimatePresence, useDragControls } from 'motion/react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Field } from '@/components/forms/fields';
import { WhatsAppSubmit } from '@/components/forms/WhatsAppSubmit';
import { useMotionTier } from '@/components/motion/tier';
import { Photo } from '@/components/ui/Photo';
import { formatNaira } from '@/lib/format';
import type { Site } from '@/lib/site';
import { buildOrderMessage, isValidNgPhone } from '@/lib/whatsapp';
import { useHydrated } from './CartHydrator';
import { cartSubtotal, useCart, type CartLine } from './store';

/** Slides in from the right on desktop (backdrop blur); springs up as a bottom sheet on mobile, drag to close. */
export function CartDrawer({ site }: { site: Site }) {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const { desktop } = useMotionTier();
  const drag = useDragControls();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    const t = setTimeout(() => panel.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', esc);
      clearTimeout(t);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end lg:flex-row lg:justify-end">
          <m.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <m.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            className="relative flex max-h-[88dvh] flex-col overflow-hidden rounded-t-2xl bg-bg text-text outline-none lg:h-full lg:max-h-none lg:w-[460px] lg:rounded-none"
            {...(desktop
              ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
              : {
                  initial: { y: '100%' },
                  animate: { y: 0 },
                  exit: { y: '100%' },
                  transition: { type: 'spring', damping: 30, stiffness: 300 },
                  drag: 'y' as const,
                  dragControls: drag,
                  dragListener: false,
                  dragConstraints: { top: 0, bottom: 0 },
                  dragElastic: { top: 0, bottom: 0.6 },
                  onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
                    if (info.offset.y > 120 || info.velocity.y > 500) setOpen(false);
                  },
                })}
          >
            <div className="shrink-0 touch-none px-5 pt-2.5 lg:px-10 lg:pt-9" onPointerDown={(e) => !desktop && drag.start(e)}>
              <div className="mx-auto mb-[18px] h-1 w-10 rounded-full bg-line lg:hidden" />
              <div className="flex items-baseline justify-between pb-[18px] lg:pb-[22px]">
                <h2 className="display text-[28px] lg:text-[36px]">Your order</h2>
                <button type="button" onClick={() => setOpen(false)} className="text-[14px] text-muted hover:text-text">
                  Close<span className="hidden lg:inline"> ×</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 lg:px-10 lg:pb-9">
              <CartBody site={site} />
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CartBody({ site }: { site: Site }) {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const { mode, form, sentAt } = useCart(useShallow((s) => ({ mode: s.mode, form: s.form, sentAt: s.sentAt })));
  const { add, dec, setMode, setField, markSent, clear, setOpen } = useCart.getState();
  const [tried, setTried] = useState(false);

  const groups = site.concepts
    .map((c) => ({ concept: c, items: lines.filter((l) => l.concept === c.slug) }))
    .filter((g) => g.items.length);
  const visible = groups.flatMap((g) => g.items);

  if (!hydrated || !visible.length) {
    return (
      <div className="flex flex-col gap-3.5 pb-3 lg:gap-4">
        <div className="relative h-[200px] overflow-hidden rounded-card bg-line lg:h-[280px]">
          <Photo src={site.emptyCartImage} alt="" sizes="(min-width:1024px) 380px, 100vw" />
        </div>
        <p className="text-[15px] text-muted">Nothing here yet.</p>
        <Link href={site.emptyCartHref} onClick={() => setOpen(false)} className="display text-[22px] text-accent lg:text-[26px]">
          {site.emptyCartLabel} →
        </Link>
      </div>
    );
  }

  const delivery = site.features.delivery && mode === 'delivery';
  const subtotal = cartSubtotal(visible);
  const errors = {
    name: tried && !form.name.trim() && 'Tell us who the order is for.',
    phone: tried && !isValidNgPhone(form.phone) && 'Enter an 11-digit number (or +234…).',
    address: tried && delivery && !form.address.trim() && 'Where should we deliver?',
  };

  const build = () => {
    setTried(true);
    if (!form.name.trim() || !isValidNgPhone(form.phone) || (delivery && !form.address.trim())) return null;
    return buildOrderMessage({
      brand: site.brand,
      groups: groups.map((g) => ({ name: g.concept.name, items: g.items })),
      mode: delivery ? 'delivery' : 'pickup',
      address: form.address,
      name: form.name,
      phone: form.phone,
      note: form.note,
    });
  };

  return (
    <div className="flex min-h-full flex-col gap-[18px] lg:gap-[22px]">
      {groups.map((g) => (
        <section key={g.concept.slug} className="flex flex-col">
          <h3 className="label pb-1.5 text-[11px] text-muted">{g.concept.name}</h3>
          {g.items.map((l) => (
            <Line key={l.id} line={l} onAdd={() => add(l)} onDec={() => dec(l.id)} />
          ))}
        </section>
      ))}

      {site.features.delivery && (
        <div role="radiogroup" aria-label="Delivery or pickup" className="grid grid-cols-2 rounded-full border border-text p-[3px] text-[14px] font-semibold">
          {(['delivery', 'pickup'] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={mode === k}
              onClick={() => setMode(k)}
              className={`rounded-full p-2.5 transition-colors ${mode === k ? 'bg-text text-bg' : ''}`}
            >
              {k === 'delivery' ? 'Delivery' : 'Pickup'}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3.5">
        {delivery && <Field label="Delivery address" value={form.address} onChange={(v) => setField('address', v)} error={errors.address} autoComplete="street-address" />}
        <div className="grid gap-3.5 lg:grid-cols-2 lg:gap-4">
          <Field label="Name" value={form.name} onChange={(v) => setField('name', v)} error={errors.name} autoComplete="name" />
          <Field label="Phone" value={form.phone} onChange={(v) => setField('phone', v)} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />
        </div>
        <Field label="Note for the kitchen" value={form.note} onChange={(v) => setField('note', v)} />
      </div>

      <dl className="mt-auto flex flex-col gap-1.5 text-[14px]">
        <div className="flex justify-between text-muted">
          <dt>Subtotal</dt>
          <dd>{formatNaira(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-muted">
          <dt>Delivery</dt>
          <dd>{delivery ? 'Confirmed on WhatsApp' : 'Pickup · free'}</dd>
        </div>
        <div className="flex justify-between pt-1.5 text-[18px] font-bold lg:text-[20px]">
          <dt>Total</dt>
          <dd>{formatNaira(subtotal)}</dd>
        </div>
      </dl>

      <WhatsAppSubmit number={site.whatsapp} label="Send order on WhatsApp" build={build} onSent={markSent} />
      {sentAt && (
        <button type="button" onClick={clear} className="self-center text-[14px] font-semibold underline">
          Order sent? Clear cart
        </button>
      )}
    </div>
  );
}

function Line({ line, onAdd, onDec }: { line: CartLine; onAdd: () => void; onDec: () => void }) {
  return (
    <div className="flex items-center gap-3 border-t border-line py-2.5 lg:gap-3.5 lg:py-3">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-card bg-line lg:size-14">
        {line.image && <Photo src={line.image} alt="" sizes="56px" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[15px] font-semibold">{line.name}</span>
        <span className="text-[13px] text-muted">{formatNaira(line.price * line.qty)}</span>
      </div>
      <span className="flex h-9 items-center rounded-full border border-line">
        <button type="button" onClick={onDec} className="h-full w-[30px] lg:w-8" aria-label={`Remove one ${line.name}`}>
          −
        </button>
        <span className="text-[14px] font-bold">{line.qty}</span>
        <button type="button" onClick={onAdd} className="h-full w-[30px] lg:w-8" aria-label={`Add another ${line.name}`}>
          +
        </button>
      </span>
    </div>
  );
}
