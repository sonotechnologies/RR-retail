import 'server-only';
import Papa from 'papaparse';
import { z } from 'zod';
import { SKINS } from '@/skins';
import { menuItemSchema, promoSchema, type MenuItem, type Promo, type Skin } from '@/skins/schema';
import { getSkin } from './skin';

export const REVALIDATE = 300; // seconds: the client's sheet edits show within 5 minutes

const bool = z.preprocess((v) => (typeof v === 'string' ? /^(true|yes|1|y)$/i.test(v.trim()) : v), z.boolean());
const optBool = (d: boolean) => z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), bool.optional().default(d));
const optStr = z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : typeof v === 'string' ? v.trim() : v), z.string().optional());

const menuRow = z.object({
  concept: z.string().trim().min(1),
  category: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().default(''),
  price: z.preprocess((v) => (typeof v === 'string' ? Number(v.replace(/[₦,\s]/g, '')) : v), z.number().int().nonnegative()),
  image: optStr,
  tags: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(/[,;|]/).map((t) => t.trim()).filter(Boolean) : v),
    z.array(z.string()).default([]),
  ),
  available: optBool(true),
  featured: optBool(false),
  order: z.preprocess((v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : 0), z.number()),
});

/** Sheets often show dates as 25/10/2026; accept that as well as 2026-10-25. */
const sheetDate = z.preprocess((v) => {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  const dmy = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return dmy ? `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}` : v.trim();
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional());

const promoRow = z.object({ text: z.string().trim().min(1), link: optStr, start: sheetDate, end: sheetDate, active: optBool(true) });

async function fetchCsv(url: string): Promise<Record<string, string>[]> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const parsed = Papa.parse<Record<string, string>>(await res.text(), {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  return parsed.data;
}

/** Relative image paths live in public/skins/<id>/; full URLs and /public paths pass through. */
export function resolveImage(skin: Skin, image?: string): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//.test(image) || image.startsWith('/')) return image;
  return `/skins/${skin.id}/${image.replace(/^\.?\/?(images\/)?/, '')}`;
}

function fallbackMenu(skin: Skin): MenuItem[] {
  return SKINS[skin.id].menu.map((m) => menuItemSchema.parse(m));
}

/** Full menu in sheet order (or by `order` where set). Sheet first, skins/<id>/menu.ts as fallback. */
export async function getMenu(): Promise<MenuItem[]> {
  const skin = getSkin();
  let items: MenuItem[] | undefined;
  if (skin.sheet?.menuCsvUrl) {
    try {
      const rows = await fetchCsv(skin.sheet.menuCsvUrl);
      items = [];
      rows.forEach((row, i) => {
        const r = menuRow.safeParse(row);
        if (!r.success) {
          console.warn(`[menu] skipping sheet row ${i + 2}: ${r.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join('; ')}`);
          return;
        }
        items!.push(menuItemSchema.parse(r.data));
      });
      if (!items.length) throw new Error('no valid rows');
    } catch (err) {
      console.warn(`[menu] sheet unavailable (${(err as Error).message}); using fallback menu`);
      items = undefined;
    }
  }
  items ??= fallbackMenu(skin);
  const concepts = new Set(skin.concepts.map((c) => c.slug));
  return items
    .filter((m) => {
      if (concepts.has(m.concept)) return true;
      console.warn(`[menu] skipping "${m.name}": unknown concept "${m.concept}"`);
      return false;
    })
    .map((m) => ({ ...m, image: resolveImage(skin, m.image) }))
    // Stable sort: rows keep their sheet position unless `order` is set; ordered rows come first.
    .sort((a, b) => (a.order || Infinity) - (b.order || Infinity) || 0);
}

/** Stable id for cart lines; survives reordering rows in the sheet. */
export const itemId = (m: Pick<MenuItem, 'concept' | 'name'>) =>
  `${m.concept}:${m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

/** Menu rows of one concept grouped by category, in the concept's tab order (unknown categories last). */
export function groupByCategory(items: MenuItem[], categories: string[]): Array<{ name: string; items: MenuItem[] }> {
  const names = [...categories];
  for (const m of items) if (!names.includes(m.category)) names.push(m.category);
  return names.map((name) => ({ name, items: items.filter((m) => m.category === name) })).filter((g) => g.items.length);
}

const lagosToday = () => new Date(Date.now() + 3600_000).toISOString().slice(0, 10);

/** First active promo within its dates, or the skin's fallback promo. */
export async function getPromo(): Promise<Promo | null> {
  const skin = getSkin();
  if (!skin.features.promoBanner) return null;
  let promos: Promo[] | undefined;
  if (skin.sheet?.promosCsvUrl) {
    try {
      promos = (await fetchCsv(skin.sheet.promosCsvUrl)).flatMap((row, i) => {
        const r = promoRow.safeParse(row);
        if (r.success) return [promoSchema.parse(r.data)];
        console.warn(`[promos] skipping sheet row ${i + 2}`);
        return [];
      });
    } catch (err) {
      console.warn(`[promos] sheet unavailable (${(err as Error).message}); using fallback promo`);
    }
  }
  promos ??= skin.promo ? [skin.promo] : [];
  const today = lagosToday();
  return promos.find((p) => p.active && (!p.start || p.start <= today) && (!p.end || p.end >= today)) ?? null;
}
