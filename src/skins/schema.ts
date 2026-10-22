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

export const skinSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
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
  theme: z.object({
    colors: z.object({ bg: hex, surface: hex, text: hex, textMuted: hex, accent: hex, accentInk: hex, line: hex }),
    fonts: z.object({ display: z.enum(['Fraunces', 'Cormorant Garamond']), body: z.enum(['Manrope']) }),
    radius: z.object({ card: z.string(), button: z.string() }),
    mode: z.enum(['light', 'dark']),
  }),
  concepts: z.array(conceptSchema).min(1),
  contact: z.object({
    whatsapp: z.string().regex(/^\d{10,15}$/, 'International format, digits only, no +'),
    phone: z.string(),
    email: z.string().email().optional(),
    address: z.string(),
    directions: z.string(),
    mapEmbedUrl: z.string().url(),
    mapsLink: z.string().url(),
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    socials: z.object({ tiktok: z.string().optional(), instagram: z.string().optional(), facebook: z.string().optional() }),
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
  socialEmbeds: z.array(z.object({ platform: z.enum(['tiktok', 'instagram']), url: z.string().url(), poster: src, views: z.string().optional() })),
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
  seo: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: src,
    siteUrl: z.string().url(),
    /** Concept pages are titled "<Concept> in <area> — <Brand>". */
    area: z.string().default('Lekki'),
    noindex: z.boolean().default(false),
  }),
  credit: z.boolean(),
});

export type Skin = z.infer<typeof skinSchema>;
export type SkinInput = z.input<typeof skinSchema>;
export type Concept = z.infer<typeof conceptSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuItemInput = z.input<typeof menuItemSchema>;
export type Promo = z.infer<typeof promoSchema>;
