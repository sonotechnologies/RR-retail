import type { Badge as BadgeName } from '@/lib/store';

const STYLE: Record<BadgeName, string> = {
  New: 'bg-accent text-ink',
  Restocked: 'bg-text text-bg',
  'Few left': 'bg-sale text-white',
  'Sold out': 'bg-soldout text-text',
};

/** New / Restocked / Few left / Sold out. */
export function Badge({ name, className = '' }: { name: BadgeName; className?: string }) {
  return <span className={`rounded-full px-2 py-[3px] text-[10px] leading-[1.4] font-extrabold lg:px-2.5 lg:py-1 lg:text-[11px] ${STYLE[name]} ${className}`}>{name}</span>;
}
