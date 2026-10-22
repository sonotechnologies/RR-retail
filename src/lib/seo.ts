import type { Concept, MenuItem, Skin } from '@/skins/schema';
import { DAYS } from '@/skins/schema';

const DAY_NAME = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' } as const;

const abs = (skin: Skin, src: string) => (src.startsWith('/') ? `${skin.seo.siteUrl.replace(/\/$/, '')}${src}` : src);

export function openingHours(c: Concept) {
  return DAYS.flatMap((d) => {
    const h = c.hours[d];
    return h ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_NAME[d], opens: h[0], closes: h[1] }] : [];
  });
}

function address(skin: Skin) {
  return { '@type': 'PostalAddress', streetAddress: skin.contact.address, addressLocality: 'Lagos', addressCountry: 'NG' };
}

/** Restaurant + Menu, on concept pages. */
export function conceptJsonLd(skin: Skin, c: Concept, groups: Array<{ name: string; items: MenuItem[] }>) {
  const url = `${skin.seo.siteUrl.replace(/\/$/, '')}/${c.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: `${c.name} — ${skin.brand.name}`,
    url,
    image: abs(skin, c.heroImage),
    telephone: skin.contact.phone,
    address: address(skin),
    servesCuisine: ['Nigerian', 'Continental'],
    priceRange: '₦₦',
    openingHoursSpecification: openingHours(c),
    hasMenu: {
      '@type': 'Menu',
      name: `${c.name} menu`,
      hasMenuSection: groups.map((g) => ({
        '@type': 'MenuSection',
        name: g.name,
        hasMenuItem: g.items.map((m) => ({
          '@type': 'MenuItem',
          name: m.name,
          description: m.description || undefined,
          ...(m.image ? { image: abs(skin, m.image) } : {}),
          ...(m.price > 0 ? { offers: { '@type': 'Offer', price: m.price, priceCurrency: 'NGN', availability: m.available ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut' } } : {}),
        })),
      })),
    },
  };
}

/** LocalBusiness with hours (per concept) and geo, on the Visit page. */
export function visitJsonLd(skin: Skin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: skin.brand.name,
    url: skin.seo.siteUrl,
    image: abs(skin, skin.seo.ogImage),
    telephone: skin.contact.phone,
    address: address(skin),
    ...(skin.contact.geo ? { geo: { '@type': 'GeoCoordinates', latitude: skin.contact.geo.lat, longitude: skin.contact.geo.lng } } : {}),
    hasMap: skin.contact.mapsLink,
    sameAs: Object.values(skin.contact.socials).filter(Boolean),
    department: skin.concepts.map((c) => ({ '@type': 'FoodEstablishment', name: c.name, openingHoursSpecification: openingHours(c) })),
  };
}
