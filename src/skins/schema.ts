import { z } from 'zod';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Expected a #RRGGBB colour');
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:MM (24h)');
/** [open, close] in 24h Lagos time; a close at or before open runs past midnight. null = closed all day. */
const dayHours = z.tuple([time, time]).nullable();
/** A full URL, or a path under /public (e.g. /skins/napoleon/hero.jpg). */
const src = z.string().refine((s) => s.startsWith('/') || /^https?:\/\//.test(s), 'Expected a URL or /public path');

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type Day = (typeof DAYS)[number];

export const conceptSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  number: z.string(),
  name: z.string(),
  /** Short name used in tabs, chips and WhatsApp messages ("Bakery"). Defaults to name. */
  shortName: z.string().optional(),
  tagline: z.string(),
  /** Longer line under the name on the concept hero. Defaults to tagline. */
  intro: z.string().optional(),
  tint: hex.optional(),
  heroImage: src,
  gallery: z.array(src),
  hours: z.object({ mon: dayHours, tue: dayHours, wed: dayHours, thu: dayHours, fri: dayHours, sat: dayHours, sun: dayHours }),
  categories: z.array(z.string()).min(1),
});

export const menuItemSchema = z.object({
  concept: z.string(),
  category: z.string(),
  name: z.string().min(1),
  description: z.string().default(''),
  price: z.number().int().nonnegative(),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const promoSchema = z.object({
  text: z.string().min(1),
  link: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  active: z.boolean().default(true),
});

const chipList = z.array(z.string()).min(1);

// ---------- Shared by every mode ----------

const idSchema = z.string().regex(/^[a-z0-9-]+$/);

const themeSchema = z.object({
  colors: z.object({
    bg: hex,
    surface: hex,
    text: hex,
    textMuted: hex,
    accent: hex,
    accentInk: hex,
    line: hex,
    /** Accent used for text when the accent fill is too light to read (light skins). Defaults to accent. */
    accentText: hex.optional(),
    /** "Few left" badge and form errors. */
    sale: hex.optional(),
    /** Sold-out badge and struck-through chips. */
    soldOut: hex.optional(),
  }),
  fonts: z.object({ display: z.enum(['Fraunces', 'Cormorant Garamond']), body: z.enum(['Manrope']) }),
  radius: z.object({ card: z.string(), button: z.string() }),
  mode: z.enum(['light', 'dark']),
});

const whatsapp = z.string().regex(/^\d{10,15}$/, 'International format, digits only, no +');
const socialsSchema = z.object({ tiktok: z.string().optional(), instagram: z.string().optional(), facebook: z.string().optional() });
const socialEmbedSchema = z.object({ platform: z.enum(['tiktok', 'instagram']), url: z.string().url(), poster: src, views: z.string().optional() });

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: src,
  siteUrl: z.string().url(),
  /** Concept pages are titled "<Concept> in <area> — <Brand>". */
  area: z.string().default('Lekki'),
  noindex: z.boolean().default(false),
});

// ---------- Food mode (multi-concept restaurants; the original template) ----------

export const foodSkinSchema = z.object({
  /** Optional on food skins, so existing configs keep working unchanged. */
  mode: z.literal('food').default('food'),
  id: idSchema,
  brand: z.object({
    name: z.string(),
    tagline: z.string(),
    /** Small caps line above the hero headline ("Lekki · Lagos"). */
    locationLine: z.string(),
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    favicon: z.string().optional(),
    heroHeadline: z.string(),
    heroSub: z.string(),
    heroMedia: z.object({ type: z.enum(['image', 'video']), src, poster: src.optional() }),
    story: z.string(),
    storyTitle: z.string(),
    storyImages: z.tuple([src, src, src]),
  }),
  theme: themeSchema,
  concepts: z.array(conceptSchema).min(1),
  contact: z.object({
    whatsapp,
    phone: z.string(),
    email: z.string().email().optional(),
    address: z.string(),
    directions: z.string(),
    mapEmbedUrl: z.string().url(),
    mapsLink: z.string().url(),
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    socials: socialsSchema,
  }),
  features: z.object({
    cart: z.boolean(),
    reserve: z.boolean(),
    cakes: z.boolean(),
    events: z.boolean(),
    promoBanner: z.boolean(),
    socialEmbeds: z.boolean(),
    delivery: z.boolean(),
  }),
  socialEmbeds: z.array(socialEmbedSchema),
  sheet: z.object({ menuCsvUrl: z.string().url(), promosCsvUrl: z.string().url() }).optional(),
  /** Used when there is no sheet, or the promos fetch fails. */
  promo: promoSchema.optional(),
  reserve: z.object({ slots: z.array(time).min(1), maxGuests: z.number().int().min(1), sections: chipList, image: src }),
  cakes: z.object({ leadTime: z.string(), types: chipList, sizes: chipList, flavours: chipList, budgets: chipList }),
  events: z.object({
    spaces: z.array(z.object({ name: z.string(), seated: z.number().int().nullable(), standing: z.number().int(), image: src })),
    occasions: chipList,
    budgets: chipList,
  }),
  emptyCartImage: src,
  /** Concept the empty cart links to ("Start with something sweet"). */
  emptyCartConcept: z.string(),
  seo: seoSchema,
  credit: z.boolean(),
});

// ---------- Store mode (WhatsApp-first clothing sellers: retail + wholesale bundles) ----------

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const storeCategorySchema = z.object({
  slug: idSchema,
  name: z.string(),
  image: src,
  /** "Bundles": lists every product sold in bundles and shows wholesale prices, instead of filtering by category. */
  bundles: z.boolean().default(false),
});

export const storeSkinSchema = z.object({
  mode: z.literal('store'),
  id: idSchema,
  brand: z.object({
    name: z.string(),
    /** How customers address the shop in WhatsApp messages ("Hi RR"). Defaults to name. */
    shortName: z.string().optional(),
    /** Longer name for the footer ("RR Retail Stores"). Defaults to name. */
    fullName: z.string().optional(),
    /** Letters in the logo tile when there is no logo image ("RR"). Defaults to the name's initials. */
    monogram: z.string().optional(),
    logo: src.optional(),
    tagline: z.string(),
    /** Small caps line under the brand name and above the desktop hero ("Lagos · Retail & wholesale"). */
    locationLine: z.string(),
    heroHeadline: z.string(),
    heroSub: z.string(),
    heroImage: src,
    /** Landscape crop for the desktop hero. Defaults to heroImage. */
    heroImageWide: src.optional(),
    /** Short trust facts in the strip under the hero ("Pickup open 12pm – 4pm"). */
    trustLine: z.array(z.string()).default([]),
  }),
  theme: themeSchema,
  contact: z.object({ whatsapp, phone: z.string(), email: z.string().email().optional(), socials: socialsSchema }),
  store: z.object({
    categories: z.array(storeCategorySchema).min(1),
    wholesale: z.object({
      enabled: z.boolean(),
      intro: z.string(),
      /** Bundle size when a product row has no wholesale_min. */
      defaultMin: z.number().int().min(1),
      /** Shown on prices until the client confirms them ("Sample prices"). */
      sampleNote: z.string().optional(),
    }),
    fulfilment: z.object({
      pickup: z
        .object({
          address: z.string(),
          hours: z.string(),
          /** Short "how to spot it" line on the home pickup card ("Look for the red building"). */
          landmark: z.string().optional(),
          /** Step-by-step, from the nearest bus stop to the door. */
          directions: z.array(z.string()).min(1),
          photo: src.optional(),
          mapsLink: z.string().url(),
          mapEmbedUrl: z.string().url().optional(),
        })
        .optional(),
      lagosDelivery: z.boolean(),
      waybill: z.boolean(),
      feeNote: z.string(),
    }),
    telegramUrl: z.string().url().optional(),
    /** Customer chat screenshots (social proof under the TikTok row). */
    proofImages: z.array(src).default([]),
    /** Badge, toast and empty-state lines; the defaults are plain English. */
    copy: z
      .object({
        addedToast: z.string().default('Added to your bag'),
        emptyBag: z.string().default('Nothing here yet. Start with what just restocked.'),
        telegram: z.string().default('New stock drops daily on our Telegram channel.'),
        wholesaleBanner: z.string().default('Buying for your shop? Bundle prices start here.'),
        relatedTitle: z.string().default('You might also like'),
        bagOption: z.string().default('How do you want it?'),
      })
      .prefault({}),
  }),
  socialEmbeds: z.array(socialEmbedSchema).default([]),
  sheet: z.object({ productsCsvUrl: z.string().url(), promosCsvUrl: z.string().url().optional() }).optional(),
  promo: promoSchema.optional(),
  seo: seoSchema,
  credit: z.boolean(),
});

/** One product row ("Products" tab of the client's sheet, or skins/<id>/products.ts). */
export const productSchema = z.object({
  slug: idSchema,
  name: z.string().min(1),
  /** Category slug from store.categories. */
  category: z.string(),
  retailPrice: z.number().int().nonnegative(),
  /** Blank = retail only; the wholesale toggle is hidden for that item. */
  wholesalePrice: z.number().int().positive().optional(),
  /** Pieces per bundle. Defaults to store.wholesale.defaultMin. */
  wholesaleMin: z.number().int().positive().optional(),
  /** Empty = one size. */
  sizes: z.array(z.string()).default([]),
  /** "Black" or "Black #111111"; common colour names get a swatch automatically. */
  colours: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  /** New, Restocked, Few left… */
  tags: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  soldOutSizes: z.array(z.string()).default([]),
  /** Best sellers on the home page. */
  featured: z.boolean().default(false),
  restockedAt: isoDate.optional(),
  description: z.string().optional(),
});

export type FoodSkin = z.infer<typeof foodSkinSchema>;
export type FoodSkinInput = z.input<typeof foodSkinSchema>;
export type StoreSkin = z.infer<typeof storeSkinSchema>;
export type StoreSkinInput = z.input<typeof storeSkinSchema>;
export type StoreCategory = z.infer<typeof storeCategorySchema>;
export type Skin = FoodSkin | StoreSkin;
export type SkinInput = FoodSkinInput | StoreSkinInput;
export type Concept = z.infer<typeof conceptSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuItemInput = z.input<typeof menuItemSchema>;
export type Promo = z.infer<typeof promoSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductInput = z.input<typeof productSchema>;
