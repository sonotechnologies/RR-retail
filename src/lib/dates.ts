// Calendar helpers in Lagos time (UTC+1). Dates are ISO YYYY-MM-DD strings.

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function lagosToday(now = new Date()): string {
  return new Date(now.getTime() + 3600_000).toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function nextDays(from: string, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const iso = addDays(from, i);
    const d = new Date(`${iso}T00:00:00Z`);
    return { iso, dow: i === 0 ? 'Today' : DOW[d.getUTCDay()], day: String(d.getUTCDate()) };
  });
}

/** Minutes since midnight now in Lagos. */
export function lagosMinutes(now = new Date()): number {
  const d = new Date(now.getTime() + 3600_000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}
