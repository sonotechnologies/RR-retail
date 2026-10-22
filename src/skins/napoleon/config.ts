import type { FoodSkinInput } from '../schema';

// PRIVATE PITCH SKIN. Photos below are Unsplash stand-ins: replace with Napoleon's own interior and
// food photos / TikTok stills (public/skins/napoleon/...) before sending the preview link.
// Anything in [brackets] must be confirmed with the owner.
const img = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`;

export const IMG = {
  hero: img('1559339352-11d035aa65de', 2000),
  croissant: img('1555507036-ab1f4038808a'),
  gelato: img('1501443762994-82bd5dace89a'),
  dessert: img('1488477181946-6428a0291777'),
  drink: img('1497935586351-b67a49e012bf'),
  plated: img('1504674900247-0877df9cc836'),
  ribeye: img('1544025162-d76694265947'),
  bar: img('1555396273-367ea4eb4db5', 2000),
  cafe: img('1495474472287-4d71bcdd2085'),
  cake: img('1551024601-bec78aea704b'),
  interior: img('1517248135467-4c7edcad34c4', 2000),
};

// [Hours not confirmed: taken from the design round. Check with the owner.]
const daily = (open: string, close: string): FoodSkinInput['concepts'][number]['hours'] => {
  const h: [string, string] = [open, close];
  return { mon: h, tue: h, wed: h, thu: h, fri: h, sat: h, sun: h };
};

const config: FoodSkinInput = {
  id: 'napoleon',
  brand: {
    name: 'Napoleon',
    tagline: 'The new 3-in-1 spot in Lagos',
    locationLine: 'Osapa London · Lekki Phase 2',
    heroHeadline: 'The new 3-in-1 spot in Lagos',
    heroSub: 'Restaurant, café & bakery and ice cream under one roof in Osapa London.',
    heroMedia: { type: 'image', src: IMG.hero },
    storyTitle: 'Three rooms under one roof in Osapa London.',
    story: "Dinner in the restaurant, coffee and pastries in the café, a scoop on the way out. [Replace with the owner's story.]",
    storyImages: [IMG.bar, IMG.drink, IMG.hero],
  },
  theme: {
    colors: {
      bg: '#0E0D0B',
      surface: '#1A1814',
      text: '#F3EDE2',
      textMuted: '#A69C8C',
      accent: '#C9A24B',
      accentInk: '#0E0D0B',
      line: '#2E2A23',
    },
    fonts: { display: 'Cormorant Garamond', body: 'Manrope' },
    radius: { card: '0px', button: '999px' },
    mode: 'dark',
  },
  // Gold for every concept; photography carries the difference.
  concepts: [
    {
      slug: 'restaurant',
      number: '01',
      name: 'Restaurant',
      tagline: 'Dinner at Osapa London',
      tint: '#C9A24B',
      heroImage: IMG.hero,
      gallery: [IMG.ribeye, IMG.plated, IMG.bar, IMG.interior],
      hours: daily('12:00', '23:00'),
      categories: ['Mains', 'Grills', 'Drinks'],
    },
    {
      slug: 'cafe-bakery',
      number: '02',
      name: 'Café & Bakery',
      tagline: 'Coffee and fresh bakes all day',
      intro: 'Coffee and fresh bakes all day.',
      tint: '#C9A24B',
      heroImage: IMG.croissant,
      gallery: [IMG.croissant, IMG.cake, IMG.cafe, IMG.dessert, IMG.drink],
      hours: daily('08:00', '20:00'),
      categories: ['Coffee', 'Pastries', 'Cakes'],
    },
    {
      slug: 'ice-cream',
      number: '03',
      name: 'Ice Cream',
      tagline: 'Scoops until late',
      tint: '#C9A24B',
      heroImage: IMG.gelato,
      gallery: [IMG.gelato, IMG.dessert, IMG.cake],
      hours: daily('12:00', '23:00'),
      categories: ['Scoops', 'Cups & cones'],
    },
  ],
  contact: {
    whatsapp: '2347072655465',
    phone: '+234 707 265 5465',
    address: 'Osapa London, Lekki Phase 2, Lagos',
    directions: 'Directions note: [confirm landmark with owner].',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Osapa%20London%2C%20Lekki%2C%20Lagos&z=15&output=embed',
    mapsLink: 'https://www.google.com/maps/search/?api=1&query=Osapa+London+Lekki+Lagos',
    socials: { tiktok: 'https://www.tiktok.com/@napoleon_ng' },
  },
  features: {
    cart: true,
    reserve: true,
    cakes: true,
    events: true,
    promoBanner: true,
    socialEmbeds: true,
    delivery: true,
  },
  // [Replace with /video/<id> links to their best 6–8 TikToks so tiles embed on tap.]
  socialEmbeds: [
    { platform: 'tiktok', url: 'https://www.tiktok.com/@napoleon_ng', poster: img('1559339352-11d035aa65de', 600) },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@napoleon_ng', poster: img('1555507036-ab1f4038808a', 600) },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@napoleon_ng', poster: img('1501443762994-82bd5dace89a', 600) },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@napoleon_ng', poster: img('1555396273-367ea4eb4db5', 600) },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@napoleon_ng', poster: img('1497935586351-b67a49e012bf', 600) },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@napoleon_ng', poster: img('1551024601-bec78aea704b', 600) },
  ],
  // [Placeholder promo: confirm with owner or turn off.]
  promo: { text: 'Now open late on Fridays and Saturdays', active: true },
  reserve: {
    slots: ['12:30', '13:30', '18:00', '19:00', '19:30', '20:00', '20:30', '21:30'],
    maxGuests: 20,
    sections: ['Restaurant', 'Café & Bakery', 'Outdoor'],
    image: IMG.hero,
  },
  cakes: {
    leadTime: '[Confirm lead time with owner.] Custom cakes need at least 72 hours.',
    types: ['Cake', 'Tray', 'Pastry box'],
    sizes: ['6" · serves 8', '8" · serves 14', '10" · serves 22', '2-tier'],
    flavours: ['Red velvet', 'Chocolate', 'Vanilla', 'Lemon'],
    budgets: ['₦25–50k', '₦50–100k', '₦100–200k', '₦200k+'],
  },
  events: {
    // [Capacities are placeholders.]
    spaces: [
      { name: 'Restaurant', seated: 40, standing: 60, image: IMG.hero },
      { name: 'Café & Bakery', seated: 24, standing: 35, image: IMG.cafe },
      { name: 'Outdoor', seated: 30, standing: 50, image: IMG.bar },
    ],
    occasions: ['Birthday', 'Corporate', 'Engagement', 'Baby shower', 'Something else'],
    budgets: ['Under ₦500k', '₦500k–1m', '₦1–3m', '₦3m+'],
  },
  emptyCartImage: IMG.cake,
  emptyCartConcept: 'cafe-bakery',
  seo: {
    title: 'Napoleon — The new 3-in-1 spot in Lagos',
    description: 'Restaurant, café & bakery and ice cream in Osapa London, Lekki Phase 2. Reserve or order on WhatsApp.',
    ogImage: img('1559339352-11d035aa65de', 1200),
    siteUrl: 'https://napoleon-preview.vercel.app',
    // Private demo: keep out of search engines until they sign.
    noindex: true,
  },
  credit: true,
};

export default config;
