import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Photo } from '@/components/ui/Photo';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { getStoreSkin } from '@/lib/skin';
import { waLink } from '@/lib/whatsapp';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const skin = getStoreSkin();
  const p = skin.store.fulfilment.pickup;
  return {
    title: 'Pickup & delivery',
    description: p ? `Pick up at ${p.address}, open ${p.hours}. Lagos delivery and waybill nationwide.` : `Delivery from ${skin.brand.name}.`,
    alternates: { canonical: '/pickup' },
  };
}

export default function PickupPage() {
  const skin = getStoreSkin();
  const { fulfilment: f } = skin.store;
  const p = f.pickup;
  if (!p) notFound();
  const dark = skin.theme.mode === 'dark';
  const shortName = skin.brand.shortName ?? skin.brand.name;

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 pt-5 lg:grid lg:grid-cols-2 lg:gap-x-14 lg:gap-y-8 lg:px-12 lg:pt-12">
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-[11px] font-extrabold tracking-[0.14em] text-accent-text lg:text-[12px]">PICKUP & DELIVERY</span>
          <h1 className="display mt-1.5 text-[36px] leading-none lg:text-[60px]">Come pick it up</h1>
        </div>
        <div className="flex flex-col gap-1 rounded-card border border-line bg-surface px-[18px] py-4">
          <span className="text-[16px] font-bold">{p.address}</span>
          <span className="text-[14px] text-muted">Open {p.hours}</span>
          <a href={p.mapsLink} target="_blank" rel="noopener" className="mt-1.5 self-start text-[14px] font-bold text-accent-text hover:text-text">
            Open in Google Maps →
          </a>
        </div>
        {p.photo && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
            <Photo src={p.photo} alt={`The building: ${p.landmark ?? p.address}`} tint="#1B1917" sizes="(min-width:1024px) 45vw, 100vw" />
          </div>
        )}
        <ol className="flex flex-col gap-3.5">
          {p.directions.map((d, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-extrabold text-ink">{i + 1}</span>
              <span className="pt-1 text-[14px] leading-[1.45] lg:text-[16px]">{d}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-5 lg:pt-[92px]">
        {p.mapEmbedUrl && <MapEmbed src={p.mapEmbedUrl} title={`Map: ${p.address}`} dark={dark} className="aspect-[16/10]" />}
        {(f.lagosDelivery || f.waybill) && (
          <div className="grid grid-cols-2 gap-2.5">
            {f.lagosDelivery && (
              <div className="flex flex-col gap-1.5 rounded-card border border-line p-4">
                <span className="text-[15px] font-extrabold">Lagos delivery</span>
                <span className="text-[13px] leading-[1.4] text-muted">Dispatch rider to your door. Fee confirmed on WhatsApp.</span>
              </div>
            )}
            {f.waybill && (
              <div className="flex flex-col gap-1.5 rounded-card border border-line p-4">
                <span className="text-[15px] font-extrabold">Outside Lagos</span>
                <span className="text-[13px] leading-[1.4] text-muted">Waybill to your park. Fee confirmed on WhatsApp.</span>
              </div>
            )}
          </div>
        )}
        <a
          href={waLink(skin.contact.whatsapp, `Hi ${shortName}, how much is delivery to `)}
          target="_blank"
          rel="noopener"
          className="flex h-[50px] items-center justify-center gap-2 rounded-full border border-wa text-[15px] font-bold transition-colors hover:bg-wa hover:text-wa-ink"
        >
          <span className="size-2.5 rounded-full bg-wa" />
          Ask about delivery on WhatsApp
        </a>
      </div>
    </div>
  );
}
