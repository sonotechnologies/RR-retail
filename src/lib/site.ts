import type { FoodSkin } from '@/skins/schema';

/** The client-safe slice of the skin that client components need (no Zod, no server code). */
export type Site = {
  id: string;
  brand: string;
  whatsapp: string;
  phone: string;
  concepts: Array<{ slug: string; number: string; name: string; shortName: string; tint: string }>;
  features: FoodSkin['features'];
  emptyCartImage: string;
  emptyCartHref: string;
  emptyCartLabel: string;
  socials: FoodSkin['contact']['socials'];
};

export function toSite(skin: FoodSkin): Site {
  return {
    id: skin.id,
    brand: skin.brand.name,
    whatsapp: skin.contact.whatsapp,
    phone: skin.contact.phone,
    concepts: skin.concepts.map((c) => ({
      slug: c.slug,
      number: c.number,
      name: c.name,
      shortName: c.shortName ?? c.name,
      tint: c.tint ?? skin.theme.colors.accent,
    })),
    features: skin.features,
    emptyCartImage: skin.emptyCartImage,
    emptyCartHref: `/${skin.emptyCartConcept}`,
    emptyCartLabel: 'Start with something sweet',
    socials: skin.contact.socials,
  };
}

export function socialHandle(url?: string): string | undefined {
  return url?.match(/(@[\w.]+)|instagram\.com\/([\w.]+)/)?.slice(1).find(Boolean)?.replace(/^(?!@)/, '@');
}
