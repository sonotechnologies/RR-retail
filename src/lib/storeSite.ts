import type { StoreSkin } from '@/skins/schema';

/** The client-safe slice of a store skin that client components need (no Zod, no server code). */
export type StoreSite = {
  id: string;
  brand: string;
  /** "Hi RR" in WhatsApp messages. */
  shortName: string;
  monogram: string;
  logo?: string;
  locationLine: string;
  whatsapp: string;
  phone: string;
  siteUrl: string;
  categories: Array<{ slug: string; name: string; bundles: boolean }>;
  wholesale: { enabled: boolean; defaultMin: number; sampleNote?: string };
  pickup: { address: string; hours: string } | null;
  lagosDelivery: boolean;
  waybill: boolean;
  feeNote: string;
  copy: StoreSkin['store']['copy'];
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function toStoreSite(skin: StoreSkin): StoreSite {
  const { brand, store } = skin;
  const pickup = store.fulfilment.pickup;
  return {
    id: skin.id,
    brand: brand.name,
    shortName: brand.shortName ?? brand.name,
    monogram: brand.monogram ?? initials(brand.name),
    logo: brand.logo,
    locationLine: brand.locationLine,
    whatsapp: skin.contact.whatsapp,
    phone: skin.contact.phone,
    siteUrl: skin.seo.siteUrl.replace(/\/$/, ''),
    categories: store.categories.map((c) => ({ slug: c.slug, name: c.name, bundles: c.bundles })),
    wholesale: { enabled: store.wholesale.enabled, defaultMin: store.wholesale.defaultMin, sampleNote: store.wholesale.sampleNote },
    pickup: pickup ? { address: pickup.address, hours: pickup.hours } : null,
    lagosDelivery: store.fulfilment.lagosDelivery,
    waybill: store.fulfilment.waybill,
    feeNote: store.fulfilment.feeNote,
    copy: store.copy,
  };
}
