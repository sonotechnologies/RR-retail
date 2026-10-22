import 'server-only';
import { notFound } from 'next/navigation';
import { SKINS } from '@/skins';
import { foodSkinSchema, storeSkinSchema, type Concept, type FoodSkin, type Skin, type StoreSkin } from '@/skins/schema';

export const DEFAULT_SKIN = 'maison-lekki';

let cached: Skin | undefined;

/** Reads process.env.SKIN, validates the config and fails the build on errors. */
export function getSkin(): Skin {
  if (cached) return cached;
  const id = process.env.SKIN || DEFAULT_SKIN;
  const entry = SKINS[id];
  if (!entry) throw new Error(`Unknown SKIN "${id}". Available: ${Object.keys(SKINS).join(', ')}`);
  const parsed = entry.config.mode === 'store' ? storeSkinSchema.safeParse(entry.config) : foodSkinSchema.safeParse(entry.config);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Skin "${id}" is invalid:\n${issues}`);
  }
  const skin = parsed.data;
  if (skin.id !== id) throw new Error(`Skin registered as "${id}" declares id "${skin.id}"`);
  if (skin.mode === 'food') checkFood(skin);
  else checkStore(skin);
  // Per-deploy override, so one skin can be previewed on several URLs.
  const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (siteUrl) skin.seo.siteUrl = siteUrl;
  cached = skin;
  return skin;
}

const RESERVED = new Set(['reserve', 'cakes', 'events', 'visit', 'api', 'sitemap.xml', 'robots.txt', 'shop', 'p', 'wholesale', 'pickup']);

function checkFood(skin: FoodSkin) {
  const slugs = new Set<string>();
  for (const c of skin.concepts) {
    if (slugs.has(c.slug)) throw new Error(`Skin "${skin.id}": duplicate concept slug "${c.slug}"`);
    if (RESERVED.has(c.slug)) throw new Error(`Skin "${skin.id}": concept slug "${c.slug}" clashes with a route`);
    slugs.add(c.slug);
  }
  if (!slugs.has(skin.emptyCartConcept)) throw new Error(`Skin "${skin.id}": emptyCartConcept "${skin.emptyCartConcept}" is not a concept`);
}

function checkStore(skin: StoreSkin) {
  const slugs = new Set<string>();
  for (const c of skin.store.categories) {
    if (slugs.has(c.slug)) throw new Error(`Skin "${skin.id}": duplicate category slug "${c.slug}"`);
    slugs.add(c.slug);
  }
}

/** The active skin when it is a food skin; 404 on store skins (for food-only routes). */
export function getFoodSkin(): FoodSkin {
  const skin = getSkin();
  if (skin.mode !== 'food') notFound();
  return skin;
}

/** The active skin when it is a store skin; 404 on food skins (for store-only routes). */
export function getStoreSkin(): StoreSkin {
  const skin = getSkin();
  if (skin.mode !== 'store') notFound();
  return skin;
}

export function getConcept(slug: string): Concept | undefined {
  return getFoodSkin().concepts.find((c) => c.slug === slug);
}

export const shortName = (c: Concept) => c.shortName ?? c.name;
