import Image from 'next/image';
import type { StoreSite } from '@/lib/storeSite';

/** Black tile with the serif monogram ("RR"), or the client's logo image when set. */
export function LogoTile({ site, size = 36 }: { site: Pick<StoreSite, 'monogram' | 'logo' | 'brand'>; size?: number }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-line bg-black text-accent display leading-none tracking-[-0.04em] lg:rounded-[10px]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.55), fontWeight: 700 }}
    >
      {site.logo ? <Image src={site.logo} alt={site.brand} fill sizes={`${size}px`} className="object-cover" /> : site.monogram}
    </span>
  );
}
