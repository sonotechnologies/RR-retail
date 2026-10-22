// Store mode: product, bag and pricing rules. No Next.js imports, so the unit tests can run it directly.
import type { Colour } from './colours.ts';

export type Badge = 'New' | 'Restocked' | 'Few left' | 'Sold out';
export type BagMode = 'retail' | 'wholesale';

/** A product as the pages and the bag see it: sheet row with defaults resolved. */
export type StoreProduct = {
  slug: string;
  name: string;
  category: string;
  retailPrice: number;
  /** null = retail only. */
  wholesalePrice: number | null;
  /** Pieces per bundle. */
  wholesaleMin: number;
  sizes: string[];
  colours: Colour[];
  images: string[];
  tags: string[];
  inStock: boolean;
  soldOutSizes: string[];
  featured: boolean;
  restockedAt: string | null;
  description: string | null;
  badge: Badge | null;
  /** Restocked within the last 7 days. */
  recent: boolean;
  /** Sheet order. */
  index: number;
};

export const MIXED = 'Mixed';
export const ONE_SIZE = 'One size';
export const RECENT_DAYS = 7;

export const lagosToday = (now = new Date()) => new Date(now.getTime() + 3600_000).toISOString().slice(0, 10);

export function isRecent(restockedAt: string | null | undefined, today: string, days = RECENT_DAYS): boolean {
  if (!restockedAt) return false;
  const diff = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${restockedAt}T00:00:00Z`)) / 86_400_000;
  return diff >= 0 && diff < days;
}

const BADGES: Badge[] = ['Few left', 'New', 'Restocked'];

/** Sold out wins, then the first known tag (Few left › New › Restocked), then "Restocked" for a recent restock. */
export function badgeFor(p: Pick<StoreProduct, 'inStock' | 'tags'>, recent: boolean): Badge | null {
  if (!p.inStock) return 'Sold out';
  const tags = p.tags.map((t) => t.toLowerCase());
  return BADGES.find((b) => tags.includes(b.toLowerCase())) ?? (recent ? 'Restocked' : null);
}

export const sellsWholesale = (p: Pick<StoreProduct, 'wholesalePrice'>) => p.wholesalePrice !== null;

// ---------- Bag ----------

export type BagLine = {
  /** slug|mode|size|colour: adding the same thing again bumps the quantity. */
  key: string;
  slug: string;
  name: string;
  image?: string;
  mode: BagMode;
  size: string;
  colour: string;
  /** Pieces in retail, bundles in wholesale. */
  qty: number;
  /** Per piece. */
  unitPrice: number;
  /** Pieces per bundle (wholesale); 1 in retail. */
  min: number;
};

export const lineKey = (l: Pick<BagLine, 'slug' | 'mode' | 'size' | 'colour'>) => [l.slug, l.mode, l.size, l.colour].join('|');

/** Retail: qty = pieces. Wholesale: qty = bundles, pieces = bundles × min. */
export const linePieces = (l: Pick<BagLine, 'mode' | 'qty' | 'min'>) => (l.mode === 'wholesale' ? l.qty * l.min : l.qty);
export const lineTotal = (l: Pick<BagLine, 'mode' | 'qty' | 'min' | 'unitPrice'>) => linePieces(l) * l.unitPrice;
export const bagPieces = (lines: BagLine[]) => lines.reduce((a, l) => a + linePieces(l), 0);
export const bagTotal = (lines: BagLine[]) => lines.reduce((a, l) => a + lineTotal(l), 0);
/** Header badge: pieces + bundles, as the customer counts them. */
export const bagCount = (lines: BagLine[]) => lines.reduce((a, l) => a + l.qty, 0);

/** Quantity stepper bounds. */
export const MAX_QTY: Record<BagMode, number> = { retail: 10, wholesale: 20 };

/** "M, Black" · "Mixed sizes, Black" · "M, mixed colours" · "Mixed sizes/colours". */
export function variantLabel(size: string, colour: string): string {
  const ms = size === MIXED;
  const mc = colour === MIXED;
  if (ms && mc) return 'Mixed sizes/colours';
  if (ms) return `Mixed sizes${colour ? `, ${colour}` : ''}`;
  if (mc) return `${size}, mixed colours`;
  return [size, colour].filter(Boolean).join(', ');
}

// ---------- Shop filters ----------

export type PriceBand = 'under-5k' | '5k-10k' | 'over-10k';
export const PRICE_BANDS: Array<{ id: PriceBand; label: string; test: (n: number) => boolean }> = [
  { id: 'under-5k', label: 'Under ₦5,000', test: (n) => n < 5000 },
  { id: '5k-10k', label: '₦5,000 – ₦10,000', test: (n) => n >= 5000 && n <= 10000 },
  { id: 'over-10k', label: 'Over ₦10,000', test: (n) => n > 10000 },
];

export type ShopSort = 'newest' | 'price';
export type ShopFilters = { q: string; size: string | null; band: PriceBand | null; inStock: boolean; sort: ShopSort };
export const NO_FILTERS: ShopFilters = { q: '', size: null, band: null, inStock: false, sort: 'newest' };

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^\w\s]/g, ' ');

/** Client-side filter + sort over the loaded list (expected < 300 items). */
export function filterProducts(list: StoreProduct[], f: ShopFilters, categoryNames: Record<string, string> = {}): StoreProduct[] {
  const words = norm(f.q).split(/\s+/).filter(Boolean);
  const out = list.filter((p) => {
    if (words.length) {
      const hay = norm(`${p.name} ${categoryNames[p.category] ?? p.category} ${p.colours.map((c) => c.name).join(' ')} ${p.tags.join(' ')}`);
      if (!words.every((w) => hay.includes(w))) return false;
    }
    if (f.size && !(p.sizes.includes(f.size) && !p.soldOutSizes.includes(f.size))) return false;
    if (f.band && !PRICE_BANDS.find((b) => b.id === f.band)!.test(p.retailPrice)) return false;
    if (f.inStock && !p.inStock) return false;
    return true;
  });
  return out.sort(f.sort === 'price' ? (a, b) => a.retailPrice - b.retailPrice || a.index - b.index : newest);
}

/** Newest restock first; undated rows keep sheet order after them. Sold-out items sink to the end. */
function newest(a: StoreProduct, b: StoreProduct) {
  if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
  const ra = a.restockedAt ?? '';
  const rb = b.restockedAt ?? '';
  return ra === rb ? a.index - b.index : ra < rb ? 1 : -1;
}

/** Sizes offered across a list, in a sensible order (letters by size, then numbers). */
const LETTER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];
export function allSizes(list: StoreProduct[]): string[] {
  const set = new Set(list.flatMap((p) => p.sizes));
  const rank = (s: string) => {
    const i = LETTER.indexOf(s.toUpperCase());
    return i >= 0 ? i : /^\d+$/.test(s) ? 100 + Number(s) : 1000;
  };
  return [...set].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}
