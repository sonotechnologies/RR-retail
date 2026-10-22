'use client';

import { useEffect, useState } from 'react';
import { getStatus, STATUS_DOT, type Hours, type OpenStatus } from '@/lib/hours';

/** Green "Open until 10pm" / amber "Closing soon · 6pm" / grey "Opens 8am".
 *  Renders the status computed at build/revalidate time, then refreshes live in Lagos time. */
export function OpenBadge({ hours, initial, variant = 'pill', className = '' }: { hours: Hours; initial: OpenStatus; variant?: 'pill' | 'plain'; className?: string }) {
  const status = useLiveStatus(hours, initial);
  const dot = <span className="size-1.5 shrink-0 rounded-full lg:size-[7px]" style={{ background: STATUS_DOT[status.state] }} />;
  if (variant === 'plain') {
    return (
      <span className={`inline-flex items-center gap-[7px] ${className}`}>
        {dot}
        {status.label}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-1.5 text-[11px] leading-none text-text lg:gap-[7px] lg:px-3 lg:py-[7px] lg:text-[12px] ${status.state === 'closed' ? 'text-muted' : ''} ${className}`}
    >
      {dot}
      {status.label}
    </span>
  );
}

export function useLiveStatus(hours: Hours, initial: OpenStatus) {
  const [status, setStatus] = useState(initial);
  useEffect(() => {
    const tick = () => setStatus(getStatus(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);
  return status;
}
