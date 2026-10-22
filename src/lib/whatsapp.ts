// WhatsApp message builders. Every submit ends in https://wa.me/<number>?text=<encoded>.
import { formatNaira } from './format.ts';
import { formatTime } from './hours.ts';
import { MIXED, lineTotal, linePieces, variantLabel, type BagLine } from './store.ts';

const SEP = '  ·  ';

export function waLink(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Nigerian phone: 11 digits starting 0, or +234 followed by 10 digits. Spaces and dashes allowed. */
export function isValidNgPhone(raw: string): boolean {
  const s = raw.replace(/[\s()-]/g, '');
  return /^0\d{10}$/.test(s) || /^\+?234\d{10}$/.test(s);
}

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-10-25' → 'Sat 25 Oct 2026'. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DOW[dt.getUTCDay()]} ${d} ${MON[m - 1]} ${y}`;
}

const line = (...pairs: Array<[string, string | undefined]>) =>
  pairs
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v!.trim()}`)
    .join(SEP);

const join = (lines: Array<string | false | undefined>) => lines.filter((l) => l !== false && l !== undefined).join('\n');

export type OrderGroup = { name: string; items: Array<{ name: string; qty: number; price: number }> };

export function buildOrderMessage(o: {
  brand: string;
  groups: OrderGroup[];
  mode: 'delivery' | 'pickup';
  address?: string;
  name: string;
  phone: string;
  note?: string;
}): string {
  const subtotal = o.groups.reduce((a, g) => a + g.items.reduce((b, i) => b + i.qty * i.price, 0), 0);
  const blocks = o.groups.map((g) => [g.name.toUpperCase(), ...g.items.map((i) => `${i.qty} × ${i.name} — ${formatNaira(i.qty * i.price)}`)].join('\n'));
  const delivery = o.mode === 'delivery';
  return join([
    `New order — ${o.brand}`,
    '',
    blocks.join('\n\n'),
    '',
    `Subtotal: ${formatNaira(subtotal)}`,
    `Pickup / Delivery: ${delivery ? 'Delivery' : 'Pickup'}`,
    delivery && o.address?.trim() ? `Address: ${o.address.trim()}` : undefined,
    line(['Name', o.name], ['Phone', o.phone]),
    o.note?.trim() ? `Note: ${o.note.trim()}` : undefined,
    delivery && '(Delivery fee to be confirmed)',
  ]);
}

export function buildReservationMessage(r: {
  brand: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  section: string;
  name: string;
  phone: string;
  note?: string;
}): string {
  return join([
    `Table request — ${r.brand}`,
    line(['Date', formatDate(r.date)], ['Time', formatTime(r.time, true)]),
    line(['Guests', String(r.guests)], ['Section', r.section]),
    line(['Name', r.name], ['Phone', r.phone]),
    r.note?.trim() ? `Note: ${r.note.trim()}` : undefined,
  ]);
}

export function buildCakeMessage(c: {
  brand: string;
  date: string;
  type: string;
  size: string;
  flavour: string;
  message?: string;
  budget: string;
  name: string;
  phone: string;
}): string {
  return join([
    `Cake / bulk request — ${c.brand}`,
    `Date needed: ${formatDate(c.date)}`,
    line(['Type', c.type], ['Size', c.size]),
    `Flavour: ${c.flavour}`,
    c.message?.trim() ? `Message on cake: "${c.message.trim()}"` : undefined,
    `Budget: ${c.budget}`,
    line(['Name', c.name], ['Phone', c.phone]),
    "I'll send a reference photo here.",
  ]);
}

export function buildEventMessage(e: {
  brand: string;
  occasion: string;
  date: string;
  guests: number;
  space: string;
  budget: string;
  name: string;
  phone: string;
  details?: string;
}): string {
  return join([
    `Event enquiry — ${e.brand}`,
    `Occasion: ${e.occasion}`,
    line(['Date', formatDate(e.date)], ['Guests', String(e.guests)]),
    `Space: ${e.space}`,
    `Budget: ${e.budget}`,
    line(['Name', e.name], ['Phone', e.phone]),
    e.details?.trim() ? `Details: ${e.details.trim()}` : undefined,
  ]);
}

// ---------- Store mode ----------


export type StoreOrderLine = Pick<BagLine, 'slug' | 'name' | 'mode' | 'size' | 'colour' | 'qty' | 'unitPrice' | 'min'>;
export type Fulfilment = 'pickup' | 'lagos' | 'waybill';

export const productUrl = (siteUrl: string, slug: string) => `${siteUrl.replace(/\/$/, '')}/p/${slug}`;

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function orderLine(l: StoreOrderLine, siteUrl: string): string {
  const head =
    l.mode === 'wholesale'
      ? `${plural(l.qty, 'bundle')} (${linePieces(l)} pcs) × ${l.name}`
      : `${l.qty} × ${l.name}`;
  return `${head} — ${variantLabel(l.size, l.colour)} — ${formatNaira(lineTotal(l))}\n${productUrl(siteUrl, l.slug)}`;
}

/** Retail, wholesale or mixed bag → one message (mixed bags get two labelled sections). */
export function buildStoreOrderMessage(o: {
  brand: string;
  siteUrl: string;
  lines: StoreOrderLine[];
  fulfilment: Fulfilment;
  pickupHours?: string;
  address?: string;
  name: string;
  phone: string;
  note?: string;
}): string {
  const retail = o.lines.filter((l) => l.mode === 'retail');
  const wholesale = o.lines.filter((l) => l.mode === 'wholesale');
  const total = o.lines.reduce((a, l) => a + lineTotal(l), 0);
  const pieces = o.lines.reduce((a, l) => a + linePieces(l), 0);
  const list = (ls: StoreOrderLine[]) => ls.map((l) => orderLine(l, o.siteUrl)).join('\n');
  const address = o.address?.trim() || '—';

  const title = !wholesale.length
    ? `New order — ${o.brand} (Retail)`
    : !retail.length
      ? `New WHOLESALE order — ${o.brand}`
      : `New order — ${o.brand} (Retail + Wholesale)`;
  const body = retail.length && wholesale.length ? `RETAIL\n${list(retail)}\n\nWHOLESALE\n${list(wholesale)}` : list(o.lines);
  const option =
    o.fulfilment === 'pickup'
      ? `Option: Pickup${o.pickupHours ? ` (${o.pickupHours})` : ''}`
      : o.fulfilment === 'lagos'
        ? 'Option: Lagos delivery (fee to be confirmed)'
        : `Option: Waybill to ${address} (fee to be confirmed)`;

  return join([
    title,
    '',
    body,
    '',
    wholesale.length ? `Total: ${plural(pieces, 'piece')} · ${formatNaira(total)}` : `Subtotal: ${formatNaira(total)}`,
    option,
    `Name: ${o.name.trim()} · Phone: ${o.phone.trim()}`,
    o.fulfilment === 'lagos' ? `Address: ${address}` : undefined,
    `Note: ${o.note?.trim() || '—'}`,
  ]);
}

/** "Ask on WhatsApp" from a product page. */
export function buildProductQuestion(q: {
  shortName: string;
  name: string;
  url: string;
  mode: 'retail' | 'wholesale';
  inStock: boolean;
  size?: string | null;
  colour?: string | null;
  wholesalePrice?: number | null;
  wholesaleMin?: number;
}): string {
  if (!q.inStock) return `Hi ${q.shortName}, when will the ${q.name} be back in stock? ${q.url}`;
  if (q.mode === 'wholesale') {
    const price = q.wholesalePrice ? ` at ${formatNaira(q.wholesalePrice)}/pc` : '';
    return `Hi ${q.shortName}, is the ${q.name} available for wholesale (bundle of ${q.wholesaleMin} pcs${price})? ${q.url}`;
  }
  const variant = [q.size && q.size !== MIXED ? q.size : null, q.colour && q.colour !== MIXED ? q.colour : null].filter(Boolean).join(', ');
  return `Hi ${q.shortName}, is the ${q.name} available${variant ? ` in ${variant}` : ''}? ${q.url}`;
}

/** "Request a custom mix" form on /wholesale. */
export function buildCustomMixMessage(m: {
  shortName: string;
  siteUrl: string;
  items: Array<{ slug: string; name: string; pieces: number }>;
  name?: string;
  phone?: string;
}): string {
  const items = m.items.filter((i) => i.pieces > 0);
  const total = items.reduce((a, i) => a + i.pieces, 0);
  const who = [m.name?.trim() && `Name: ${m.name.trim()}`, m.phone?.trim() && `Phone: ${m.phone.trim()}`].filter(Boolean).join(' · ');
  return join([
    `Hi ${m.shortName}, I'd like a custom wholesale mix:`,
    '',
    items.map((i, n) => `${n + 1}. ${i.name} — ${i.pieces} pcs\n   ${productUrl(m.siteUrl, i.slug)}`).join('\n'),
    '',
    `Total: ${plural(total, 'piece')}`,
    who || undefined,
    "Please confirm prices and what's in stock.",
  ]);
}
