import type { StoreSkinInput } from '../schema';

// PRIVATE PITCH SKIN (store mode). Photos are Unsplash stand-ins: replace them with RR's own
// TikTok/WhatsApp product photos, logo and chat screenshots (public/skins/rr-retail/...) before
// sending the preview link. Anything in [brackets] must be confirmed with RR.
const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`;

export const IMG = {
  hero: img('1532453288672-3a27e9be9efd', 1200),
  heroWide: img('1441984904996-e0b6ba687e04', 1600),
  ladies: img('1490481651871-ab68de25d43d', 1000),
  men: img('1489987707025-afc232f7ea0f'),
  jeans: img('1714729382668-7bc3bb261662'),
  basics: img('1562157873-818bc0726f68'),
  bundles: img('1555529771-835f59fc5efe'),
};

const tiktok = 'https://www.tiktok.com/@rr.retail.stores';
// [Replace with /video/<id> links to their best TikToks so each tile embeds on tap.]
const TIKTOK_STILLS = [
  '1540221652346-e5dd6b50f3e7',
  '1582719188393-bb71ca45dbb9',
  '1603400521630-9f2de124b33b',
  '1483985988355-763728e1935b',
  '1604176354204-9268737828e4',
  '1768228542712-0d68063ec9a9',
];

const config: StoreSkinInput = {
  mode: 'store',
  id: 'rr-retail',
  brand: {
    name: 'RR Retail',
    shortName: 'RR',
    fullName: 'RR Retail Stores',
    monogram: 'RR',
    // [Drop their profile logo in public/skins/rr-retail/logo.png and set logo: '/skins/rr-retail/logo.png'.]
    tagline: 'Affordable fashion in Lagos. Retail and wholesale.',
    locationLine: 'Lagos · Retail & wholesale',
    heroHeadline: 'Rack it. Restock it. Rock it.',
    heroSub: 'Affordable fashion in Lagos. Retail and wholesale.',
    heroImage: IMG.hero,
    heroImageWide: IMG.heroWide,
    trustLine: ['Pickup open 12pm – 4pm', 'WhatsApp 0904 786 8240', 'Waybill nationwide'],
  },
  theme: {
    colors: {
      bg: '#0F0E0D',
      surface: '#1B1917',
      text: '#F5EFE9',
      textMuted: '#A89F96',
      accent: '#D29A7E',
      accentInk: '#0F0E0D',
      line: '#2D2926',
      sale: '#E2574C',
      soldOut: '#5C5650',
    },
    fonts: { display: 'Cormorant Garamond', body: 'Manrope' },
    radius: { card: '10px', button: '999px' },
    mode: 'dark',
  },
  contact: {
    whatsapp: '2349047868240',
    phone: '0904 786 8240',
    socials: { tiktok },
  },
  store: {
    categories: [
      { slug: 'ladies', name: 'Ladies', image: IMG.ladies },
      { slug: 'men', name: 'Men', image: IMG.men },
      { slug: 'jeans-joggers', name: 'Jeans & Joggers', image: IMG.jeans },
      { slug: 'basics', name: 'Basics', image: IMG.basics },
      { slug: 'bundles', name: 'Bundles', image: IMG.bundles, bundles: true },
    ],
    wholesale: {
      enabled: true,
      intro: 'Prices are per piece. Bundles are 20–30 pieces of one item; sizes and colours can be mixed inside a bundle.',
      defaultMin: 20,
      // [Wholesale prices are placeholders until RR confirms them. Remove this line once they do.]
      sampleNote: 'Sample wholesale prices',
    },
    fulfilment: {
      pickup: {
        // [Confirm the exact address and shop number with RR.]
        address: 'Near Starkit Pet Store, Aboru, Lagos',
        hours: '12pm – 4pm',
        landmark: 'Look for the red building',
        // From their pinned TikTok.
        directions: [
          'Get to Iyana Ipaja, then take a bus to Akinola Junction, Aboru.',
          'Walk towards Starkit Pet Store.',
          'Look for the red building beside it and ask for RR Retail. Show your WhatsApp order.',
        ],
        // [Add their red-building photo: photo: '/skins/rr-retail/pickup.jpg'.]
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Starkit+Pet+Store+Aboru+Lagos',
        mapEmbedUrl: 'https://maps.google.com/maps?q=Aboru%2C%20Lagos&z=15&output=embed',
      },
      lagosDelivery: true,
      waybill: true,
      feeNote: 'Delivery fee confirmed on WhatsApp',
    },
    // [Use the Telegram channel link from their bio.]
    telegramUrl: 'https://t.me/',
    // [Add 3–4 customer chat screenshots: '/skins/rr-retail/chat-1.jpg', …]
    proofImages: [],
    copy: {
      addedToast: 'Added! Your bag dey wait 🛍️',
      emptyBag: 'Nothing here yet. Start with what just restocked.',
      telegram: "New stock drops daily on our Telegram. Don't miss am.",
      wholesaleBanner: 'Buying for your shop? Bundle prices start here.',
      relatedTitle: 'You go like these too',
      bagOption: 'How you want am?',
    },
  },
  socialEmbeds: TIKTOK_STILLS.map((id) => ({ platform: 'tiktok' as const, url: tiktok, poster: img(id, 400) })),
  // [Connect their sheet: sheet: { productsCsvUrl: 'https://docs.google.com/…&output=csv' }]
  seo: {
    title: 'RR Retail — Affordable fashion in Lagos, retail and wholesale',
    description: 'Ladies tops, round necks, joggers, baggy jeans and polos. Order retail or by the bundle on WhatsApp; pickup in Aboru, Lagos or delivery nationwide.',
    ogImage: img('1532453288672-3a27e9be9efd', 1200),
    siteUrl: 'https://rr-retail-preview.vercel.app',
    area: 'Lagos',
    // Private demo: keep out of search engines until they sign.
    noindex: true,
  },
  credit: true,
};

export default config;
