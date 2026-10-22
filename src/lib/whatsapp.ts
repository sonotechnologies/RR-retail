// WhatsApp message builders. Every submit ends in https://wa.me/<number>?text=<encoded>.
import { formatNaira } from './format.ts';
import { formatTime } from './hours.ts';

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
