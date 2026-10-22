import Link from 'next/link';
import { weeklySummary } from '@/lib/hours';
import { socialHandle } from '@/lib/site';
import { waLink } from '@/lib/whatsapp';
import type { FoodSkin } from '@/skins/schema';

export function Footer({ skin }: { skin: FoodSkin }) {
  const { contact } = skin;
  const socials = (['instagram', 'tiktok', 'facebook'] as const).flatMap((k) => (contact.socials[k] ? [{ k, url: contact.socials[k]! }] : []));
  return (
    <footer className="border-t border-line px-5 pt-12 pb-24 text-[13px] text-muted lg:px-12 lg:py-16 lg:text-[14px]">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-12">
        <Link href="/" className="display text-[28px] leading-none text-text lg:text-[44px]">
          {skin.brand.name}
        </Link>
        <div className="flex flex-col gap-2">
          <span>{contact.address}</span>
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-text">
            {contact.phone}
          </a>
          <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener" className="font-semibold text-text hover:opacity-75">
            WhatsApp us →
          </a>
        </div>
        <dl className="flex flex-col gap-2">
          {skin.concepts.map((c) => (
            <div key={c.slug}>
              <dt className="inline text-text">{c.shortName ?? c.name}</dt> <dd className="inline">· {weeklySummary(c.hours)}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-2">
          {socials.map((s) => (
            <a key={s.k} href={s.url} target="_blank" rel="noopener" className="hover:text-text">
              {s.k === 'instagram' ? 'IG' : s.k === 'tiktok' ? 'TikTok' : 'Facebook'} {socialHandle(s.url)}
            </a>
          ))}
          {skin.credit && <span className="label mt-2 text-[11px]">Site by Sono Technologies</span>}
        </div>
      </div>
    </footer>
  );
}
