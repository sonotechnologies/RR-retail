import 'server-only';
import { SKINS } from '@/skins';
import { skinSchema, type Concept, type Skin } from '@/skins/schema';

export const DEFAULT_SKIN = 'maison-lekki';

let cached: Skin | undefined;

/** Reads process.env.SKIN, validates the config and fails the build on errors. */
export function getSkin(): Skin {
  if (cached) return cached;
  const id = process.env.SKIN || DEFAULT_SKIN;
  const entry = SKINS[id];
  if (!entry) throw new Error(`Unknown SKIN "${id}". Available: ${Object.keys(SKINS).join(', ')}`);
  const parsed = skinSchema.safeParse(entry.config);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Skin "${id}" is invalid:\n${issues}`);
  }
  const skin = parsed.data;
  if (skin.id !== id) throw new Error(`Skin registered as "${id}" declares id "${skin.id}"`);
  const slugs = new Set<string>();
  for (const c of skin.concepts) {
    if (slugs.has(c.slug)) throw new Error(`Skin "${id}": duplicate concept slug "${c.slug}"`);
    if (RESERVED.has(c.slug)) throw new Error(`Skin "${id}": concept slug "${c.slug}" clashes with a route`);
    slugs.add(c.slug);
  }
  if (!slugs.has(skin.emptyCartConcept)) throw new Error(`Skin "${id}": emptyCartConcept "${skin.emptyCartConcept}" is not a concept`);
  // Per-deploy override, so one skin can be previewed on several URLs.
  const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (siteUrl) skin.seo.siteUrl = siteUrl;
  cached = skin;
  return skin;
}

const RESERVED = new Set(['reserve', 'cakes', 'events', 'visit', 'api', 'sitemap.xml', 'robots.txt']);

export function getConcept(slug: string): Concept | undefined {
  return getSkin().concepts.find((c) => c.slug === slug);
}

export const shortName = (c: Concept) => c.shortName ?? c.name;
