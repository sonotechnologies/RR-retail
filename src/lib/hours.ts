// Open-now logic. All times are Africa/Lagos (UTC+1, no DST).
import type { Concept, Day } from '@/skins/schema';

export type Hours = Concept['hours'];
export type OpenState = 'open' | 'soon' | 'closed';
export type OpenStatus = { state: OpenState; label: string };

const ORDER: Day[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const SHORT: Record<Day, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
const WEEK: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const SOON_MIN = 60;

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/** '19:30' → '7:30pm', '12:00' → '12pm', '00:00' → '12am'. */
export function formatTime(t: string, upper = false): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 || 12;
  const s = m ? `${h12}:${String(m).padStart(2, '0')}${suffix}` : `${h12}${suffix}`;
  return upper ? s.replace(/(am|pm)$/, (x) => ` ${x.toUpperCase()}`) : s;
}

/** Day of week and minutes since midnight in Lagos. */
export function lagosNow(now: Date = new Date()): { day: Day; minutes: number; dayIndex: number } {
  const lagos = new Date(now.getTime() + 60 * 60 * 1000); // UTC+1
  const dayIndex = lagos.getUTCDay();
  return { day: ORDER[dayIndex], minutes: lagos.getUTCHours() * 60 + lagos.getUTCMinutes(), dayIndex };
}

/** Minutes until close if open at `minutes` into `day`, else null. Handles past-midnight closes. */
function openFor(hours: Hours, dayIndex: number, minutes: number): number | null {
  const today = hours[ORDER[dayIndex]];
  if (today) {
    const o = toMin(today[0]);
    let c = toMin(today[1]);
    if (c <= o) c += 24 * 60;
    if (minutes >= o && minutes < c) return c - minutes;
  }
  const yesterday = hours[ORDER[(dayIndex + 6) % 7]];
  if (yesterday) {
    const o = toMin(yesterday[0]);
    const c = toMin(yesterday[1]);
    if (c <= o && minutes < c) return c - minutes;
  }
  return null;
}

export function getStatus(hours: Hours, now: Date = new Date()): OpenStatus {
  const { minutes, dayIndex } = lagosNow(now);
  const left = openFor(hours, dayIndex, minutes);
  if (left !== null) {
    const closeAt = ((minutes + left) % (24 * 60)) as number;
    const close = formatTime(`${String(Math.floor(closeAt / 60)).padStart(2, '0')}:${String(closeAt % 60).padStart(2, '0')}`);
    return left <= SOON_MIN ? { state: 'soon', label: `Closing soon · ${close}` } : { state: 'open', label: `Open until ${close}` };
  }
  for (let i = 0; i < 7; i++) {
    const di = (dayIndex + i) % 7;
    const h = hours[ORDER[di]];
    if (!h) continue;
    if (i === 0 && toMin(h[0]) <= minutes) continue;
    const at = formatTime(h[0]);
    if (i === 0) return { state: 'closed', label: `Opens ${at}` };
    if (i === 1) return { state: 'closed', label: `Opens ${at} tomorrow` };
    return { state: 'closed', label: `Opens ${SHORT[ORDER[di]]} ${at}` };
  }
  return { state: 'closed', label: 'Closed' };
}

const range = (h: [string, string]) => `${formatTime(h[0])} – ${formatTime(h[1])}`;

/** "7am – 6pm · closed Mon", "12pm – 11pm · Sun till 10pm", "11am – 10pm daily". */
export function weeklySummary(hours: Hours): string {
  const counts = new Map<string, number>();
  for (const d of WEEK) {
    const h = hours[d];
    if (h) counts.set(h.join('-'), (counts.get(h.join('-')) ?? 0) + 1);
  }
  if (!counts.size) return 'Closed';
  const base = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const [bo, bc] = base.split('-');
  if (counts.get(base) === 7) return `${range([bo, bc])} daily`;
  const parts = [range([bo, bc])];
  for (const d of WEEK) {
    const h = hours[d];
    if (!h) parts.push(`closed ${SHORT[d]}`);
    else if (h.join('-') === base) continue;
    else if (h[0] === bo) parts.push(`${SHORT[d]} till ${formatTime(h[1])}`);
    else parts.push(`${SHORT[d]} ${range(h)}`);
  }
  return parts.join(' · ');
}

export const STATUS_DOT: Record<OpenState, string> = { open: '#2E9E5B', soon: '#D9922E', closed: '#9A9187' };
