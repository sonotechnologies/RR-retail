'use client';

import { useEffect, useState } from 'react';
import { lagosToday } from '@/lib/dates';

/** Today's date in Lagos. Starts from the server's value (static pages may be hours old) and
 *  corrects itself after mount, so the first client render matches the HTML. */
export function useToday(serverToday: string) {
  const [today, setToday] = useState(serverToday);
  useEffect(() => setToday(lagosToday()), []);
  return today;
}
