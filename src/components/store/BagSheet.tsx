'use client';

import { AnimatePresence, useDragControls } from 'motion/react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { WhatsAppSubmit } from '@/components/forms/WhatsAppSubmit';
import { useMotionTier } from '@/components/motion/tier';
import { Photo } from '@/components/ui/Photo';
import { formatNaira } from '@/lib/format';
import { bagPieces, bagTotal, lineTotal, MAX_QTY, variantLabel, type BagLine } from '@/lib/store';
import type { StoreSite } from '@/lib/storeSite';
import { buildStoreOrderMessage, isValidNgPhone, type Fulfilment } from '@/lib/whatsapp';
import { useBag } from './bag';
import { useBagHydrated } from './BagHydrator';

/** Bottom sheet on mobile (spring, drag to close); drawer from the right on desktop.
 *  Shows the bag, or a WhatsApp message preview (Ask on WhatsApp, custom mix). */
export function BagSheet({ site }: { site: StoreSite }) {
  const open = useBag((s) => s.open);
  const message = useBag((s) => s.message);
  const setOpen = useBag((s) => s.setOpen);
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

  const title = message?.title ?? 'Your bag';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end lg:flex-row lg:justify-end">
          <m.div
            className="absolute inset-0 bg-black/60 lg:backdrop-blur-[4px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <m.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-[88dvh] flex-col overflow-hidden rounded-t-[20px] border-t border-line bg-[color-mix(in_srgb,var(--bg)_70%,var(--surface))] text-text outline-none lg:h-full lg:max-h-none lg:w-[460px] lg:rounded-none lg:border-t-0 lg:border-l"
            {...(desktop
              ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
              : {
                  initial: { y: '100%' },
                  animate: { y: 0 },
                  exit: { y: '100%' },
                  // Spring that settles well under 400ms.
                  transition: { type: 'spring', damping: 32, stiffness: 380 },
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
            <div className="shrink-0 touch-none" onPointerDown={(e) => !desktop && drag.start(e)}>
              <div className="flex justify-center pt-2.5 pb-1 lg:hidden">
                <span className="h-[5px] w-10 rounded-full bg-soldout" />
              </div>
              <div className="flex items-center justify-between py-1 pr-2 pl-[18px] lg:px-8 lg:pt-7 lg:pb-3">
                <h2 className="display text-[26px] lg:text-[32px]">{title}</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex size-11 items-center justify-center text-[22px] text-muted hover:text-text">
                  ×
                </button>
              </div>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-[18px] pt-1 pb-[18px] lg:px-8 lg:pb-8">
              {message ? <MessagePreview site={site} text={message.text} /> : <BagBody site={site} />}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** WhatsApp-style bubble: exactly what the shop receives. */
export function Bubble({ text, label }: { text: string; label: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-card bg-[#0B141A] p-3.5">
      <span className="text-[11px] font-bold text-[#8696A0]">{label}</span>
      <div className="max-w-[92%] self-end rounded-[10px_2px_10px_10px] bg-[#005C4B] px-3 py-2.5 text-[13px] leading-[1.45] break-words whitespace-pre-wrap text-[#E9EDEF]">
        {text}
      </div>
    </div>
  );
}

function MessagePreview({ site, text }: { site: StoreSite; text: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Bubble text={text} label={`To ${site.brand} · ${site.phone}`} />
      <WhatsAppSubmit number={site.whatsapp} label="Send on WhatsApp" build={() => text} />
    </div>
  );
}

const OPTIONS: Array<{ id: Fulfilment; label: string }> = [
  { id: 'pickup', label: 'Pickup' },
  { id: 'lagos', label: 'Lagos delivery' },
  { id: 'waybill', label: 'Waybill' },
];

function BagBody({ site }: { site: StoreSite }) {
  const hydrated = useBagHydrated();
  const lines = useBag((s) => s.lines);
  const { fulfilment: chosen, form, sentAt } = useBag(useShallow((s) => ({ fulfilment: s.fulfilment, form: s.form, sentAt: s.sentAt })));
  const { step, setFulfilment, setField, markSent, clear, setOpen } = useBag.getState();
  const [tried, setTried] = useState(false);
  const [preview, setPreview] = useState(false);

  if (!hydrated || !lines.length) {
    return (
      <div className="flex flex-col items-center gap-4 px-2 pt-6 pb-2 text-center">
        <p className="max-w-[260px] text-[16px] font-semibold text-muted">{site.copy.emptyBag}</p>
        <Link href="/shop" onClick={() => setOpen(false)} className="flex h-12 items-center rounded-full bg-accent px-[22px] text-[15px] font-extrabold text-ink">
          See what just restocked
        </Link>
      </div>
    );
  }

  const options = OPTIONS.filter((o) => (o.id === 'pickup' ? !!site.pickup : o.id === 'lagos' ? site.lagosDelivery : site.waybill));
  const fulfilment = options.some((o) => o.id === chosen) ? chosen : (options[0]?.id ?? 'pickup');
  const needAddress = fulfilment !== 'pickup';
  const total = bagTotal(lines);
  const pieces = bagPieces(lines);
  const errors = {
    name: tried && !form.name.trim() && 'Add your name so we know who is ordering.',
    phone: tried && !isValidNgPhone(form.phone) && 'Enter an 11-digit number (or +234…).',
    address: tried && needAddress && !form.address.trim() && (fulfilment === 'waybill' ? 'Which state and park should we send it to?' : 'Where should we deliver?'),
  };
  const message = () =>
    buildStoreOrderMessage({
      brand: site.brand,
      siteUrl: site.siteUrl,
      lines,
      fulfilment,
      pickupHours: site.pickup?.hours,
      address: form.address,
      name: form.name || '—',
      phone: form.phone || '—',
      note: form.note,
    });
  const build = () => {
    setTried(true);
    if (!form.name.trim() || !isValidNgPhone(form.phone) || (needAddress && !form.address.trim())) return null;
    return message();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        {lines.map((l) => (
          <Line key={l.key} line={l} onStep={(d) => step(l.key, d)} />
        ))}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-bold text-muted">Subtotal · {pieces === 1 ? '1 piece' : `${pieces} pieces`}</span>
        <span className="text-[24px] font-extrabold">{formatNaira(total)}</span>
      </div>

      {options.length > 0 && (
        <div className="flex flex-col gap-2">
          <span id="bag-option" className="text-[13px] font-bold text-muted">
            {site.copy.bagOption}
          </span>
          <div role="radiogroup" aria-labelledby="bag-option" className="flex gap-2">
            {options.map((o) => {
              const on = o.id === fulfilment;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setFulfilment(o.id)}
                  className={`h-11 flex-1 rounded-full border px-2 text-[13px] font-extrabold transition-colors ${on ? 'border-accent bg-accent text-ink' : 'border-line hover:border-text'}`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <span className="text-[12px] text-muted">{fulfilment === 'pickup' && site.pickup ? `Free · pick up ${site.pickup.hours}` : site.feeNote}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <BoxInput label="Your name" value={form.name} onChange={(v) => setField('name', v)} error={errors.name} autoComplete="name" />
        <BoxInput label="Phone number" value={form.phone} onChange={(v) => setField('phone', v)} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />
        {needAddress && (
          <BoxInput
            label={fulfilment === 'waybill' ? 'State and park for waybill' : 'Delivery address in Lagos'}
            value={form.address}
            onChange={(v) => setField('address', v)}
            error={errors.address}
            autoComplete={fulfilment === 'lagos' ? 'street-address' : undefined}
          />
        )}
        <BoxInput label="Note (optional)" value={form.note} onChange={(v) => setField('note', v)} />
      </div>

      {preview && <Bubble text={message()} label="Preview · what we receive" />}

      <div className="flex flex-col gap-1">
        <WhatsAppSubmit number={site.whatsapp} label={`Send order on WhatsApp · ${formatNaira(total)}`} build={build} onSent={markSent} />
        <button type="button" onClick={() => setPreview(!preview)} className="h-10 text-[13px] font-bold text-muted hover:text-text">
          {preview ? 'Hide message preview' : 'Preview the WhatsApp message'}
        </button>
        {sentAt && (
          <button type="button" onClick={clear} className="self-center text-[14px] font-semibold underline">
            Order sent? Clear bag
          </button>
        )}
      </div>
    </div>
  );
}

function Line({ line: l, onStep }: { line: BagLine; onStep: (delta: number) => void }) {
  const ws = l.mode === 'wholesale';
  return (
    <div className="flex gap-3 border-b border-line py-3">
      <Link href={`/p/${l.slug}`} onClick={() => useBag.getState().setOpen(false)} className="relative aspect-[4/5] w-[60px] shrink-0 overflow-hidden rounded-[8px] bg-surface">
        {l.image && <Photo src={l.image} alt="" sizes="60px" tint="#1B1917" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="flex justify-between gap-2">
          <span className="truncate text-[14px] font-bold">{l.name}</span>
          <span className="text-[15px] font-extrabold whitespace-nowrap">{formatNaira(lineTotal(l))}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${ws ? 'bg-accent text-ink' : 'bg-line text-text'}`}>{ws ? 'Wholesale' : 'Retail'}</span>
          <span className="truncate">{variantLabel(l.size, l.colour)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex items-center rounded-full border border-line">
            <button type="button" onClick={() => onStep(-1)} aria-label={`One less ${l.name}`} className="size-[34px] text-[16px]">
              −
            </button>
            <span className="min-w-[22px] text-center text-[14px] font-extrabold" aria-live="polite">
              {l.qty}
            </span>
            <button type="button" onClick={() => onStep(1)} disabled={l.qty >= MAX_QTY[l.mode]} aria-label={`One more ${l.name}`} className="size-[34px] text-[16px] disabled:text-soldout">
              +
            </button>
          </span>
          <span className="text-right text-[12px] text-muted">{ws ? `${l.qty} × ${l.min} pcs @ ${formatNaira(l.unitPrice)}` : `${formatNaira(l.unitPrice)} each`}</span>
        </div>
      </div>
    </div>
  );
}

type BoxInputProps = { label: string; value: string; onChange: (v: string) => void; error?: string | false } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
>;

/** Boxed input with the label as placeholder (and for screen readers); error line under it. */
export function BoxInput({ label, value, onChange, error, className = '', ...rest }: BoxInputProps) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        {...rest}
        id={id}
        value={value}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`h-[46px] w-full min-w-0 rounded-card border bg-bg px-3.5 text-[16px] text-text outline-none transition-colors focus:border-accent ${error ? 'border-sale' : 'border-line'}`}
      />
      {error && (
        <span id={`${id}-err`} className="text-[13px] font-bold text-sale">
          {error}
        </span>
      )}
    </div>
  );
}
