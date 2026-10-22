import 'server-only';
import { z } from 'zod';
import { SKINS } from '@/skins';
import { productSchema, type Product, type StoreSkin } from '@/skins/schema';
import { parseColour } from './colours';
import { fetchCsv, naira, optBool, optStr, resolveImage, sheetDate } from './sheet';
import { getStoreSkin } from './skin';
import { badgeFor, isRecent, lagosToday, type StoreProduct } from './store';

const list = z.preprocess((v) => (typeof v === 'string' ? v.split('|').map((t) => t.trim()).filter(Boolean) : v), z.array(z.string()).default([]));
const optNaira = z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), naira.optional());

/** One row of the "Products" tab. Column names follow the build brief (snake_case, | separated lists). */
const productRow = z
  .object({
    slug: z.string().trim().toLowerCase().min(1),
    name: z.string().trim().min(1),
    category: z.string().trim().toLowerCase().min(1),
    retail_price: naira,
    wholesale_price: optNaira,
    wholesale_min: optNaira,
    sizes: list,
    colours: list.optional(),
    colors: list.optional(),
    images: list,
    tags: z.preprocess((v) => (typeof v === 'string' ? v.split(/[,;|]/).map((t) => t.trim()).filter(Boolean) : v), z.array(z.string()).default([])),
    in_stock: optBool(true),
    sold_out_sizes: list,
    featured: optBool(false),
    restocked_at: sheetDate,
    description: optStr,
  })
  .transform(
    (r): z.input<typeof productSchema> => ({
      slug: r.slug,
      name: r.name,
      category: r.category,
      retailPrice: r.retail_price,
      wholesalePrice: r.wholesale_price || undefined,
      wholesaleMin: r.wholesale_min || undefined,
      sizes: r.sizes,
      colours: r.colours ?? r.colors ?? [],
      images: r.images,
      tags: r.tags,
      inStock: r.in_stock,
      soldOutSizes: r.sold_out_sizes,
      featured: r.featured,
      restockedAt: r.restocked_at,
      description: r.description,
    }),
  );

function fallbackProducts(skin: StoreSkin): Product[] {
  const entry = SKINS[skin.id];
  return 'products' in entry ? entry.products.map((p) => productSchema.parse(p)) : [];
}

function toStoreProduct(skin: StoreSkin, p: Product, index: number, today: string): StoreProduct {
  const ws = skin.store.wholesale.enabled && p.wholesalePrice ? p.wholesalePrice : null;
  // Every size sold out = the whole item is sold out.
  const inStock = p.inStock && !(p.sizes.length > 0 && p.sizes.every((s) => p.soldOutSizes.includes(s)));
  const recent = isRecent(p.restockedAt, today);
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    retailPrice: p.retailPrice,
    wholesalePrice: ws,
    wholesaleMin: p.wholesaleMin ?? skin.store.wholesale.defaultMin,
    sizes: p.sizes,
    colours: p.colours.map(parseColour),
    images: p.images.flatMap((i) => resolveImage(skin, i) ?? []),
    tags: p.tags,
    inStock,
    soldOutSizes: p.soldOutSizes,
    featured: p.featured,
    restockedAt: p.restockedAt ?? null,
    description: p.description ?? null,
    badge: badgeFor({ inStock, tags: p.tags }, recent),
    recent,
    index,
  };
}

/** All products in sheet order. Sheet first (5 min ISR), skins/<id>/products.ts as fallback. */
export async function getProducts(): Promise<StoreProduct[]> {
  const skin = getStoreSkin();
  let rows: Product[] | undefined;
  if (skin.sheet?.productsCsvUrl) {
    try {
      rows = [];
      (await fetchCsv(skin.sheet.productsCsvUrl)).forEach((row, i) => {
        const r = productRow.pipe(productSchema).safeParse(row);
        if (!r.success) {
          console.warn(`[products] skipping sheet row ${i + 2}: ${r.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join('; ')}`);
          return;
        }
        rows!.push(r.data);
      });
      if (!rows.length) throw new Error('no valid rows');
    } catch (err) {
      console.warn(`[products] sheet unavailable (${(err as Error).message}); using fallback products`);
      rows = undefined;
    }
  }
  rows ??= fallbackProducts(skin);
  const categories = new Set(skin.store.categories.map((c) => c.slug));
  const seen = new Set<string>();
  const today = lagosToday();
  return rows
    .filter((p) => {
      if (seen.has(p.slug)) return console.warn(`[products] skipping duplicate slug "${p.slug}"`), false;
      seen.add(p.slug);
      if (categories.has(p.category)) return true;
      console.warn(`[products] skipping "${p.name}": unknown category "${p.category}"`);
      return false;
    })
    .map((p, i) => toStoreProduct(skin, p, i, today));
}

export async function getProduct(slug: string): Promise<StoreProduct | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}
