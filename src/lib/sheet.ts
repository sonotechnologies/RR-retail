import 'server-only';
import Papa from 'papaparse';
import { z } from 'zod';
import type { Skin } from '@/skins/schema';

// Google Sheet helpers shared by the menu (food) and product (store) loaders.

export const REVALIDATE = 300; // seconds: the client's sheet edits show within 5 minutes

export const bool = z.preprocess((v) => (typeof v === 'string' ? /^(true|yes|1|y)$/i.test(v.trim()) : v), z.boolean());
export const optBool = (d: boolean) => z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), bool.optional().default(d));
export const optStr = z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : typeof v === 'string' ? v.trim() : v), z.string().optional());
/** "₦4,000", "4000" → 4000. */
export const naira = z.preprocess((v) => (typeof v === 'string' ? Number(v.replace(/[₦,\s]/g, '')) : v), z.number().int().nonnegative());

/** Sheets often show dates as 25/10/2026; accept that as well as 2026-10-25. */
export const sheetDate = z.preprocess((v) => {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  const dmy = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return dmy ? `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}` : v.trim();
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional());

export async function fetchCsv(url: string): Promise<Record<string, string>[]> {
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
