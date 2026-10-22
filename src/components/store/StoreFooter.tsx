import Link from 'next/link';
import { socialHandle } from '@/lib/site';
import { waLink } from '@/lib/whatsapp';
import type { StoreSkin } from '@/skins/schema';

/** WhatsApp, Telegram, TikTok, pickup address and hours. */
export function StoreFooter({ skin }: { skin: StoreSkin }) {
  const { contact, store } = skin;
  const pickup = store.fulfilment.pickup;
  const tiktok = contact.socials.tiktok;
  const instagram = contact.socials.instagram;
  return (
    <footer className="mt-10 border-t border-line lg:mt-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3.5 px-4 pt-[26px] pb-5 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-8 lg:px-12 lg:py-10">
        <div className="flex flex-col gap-3.5 lg:gap-2">
          <Link href="/" className="display text-[22px] text-accent lg:text-[28px]">
            {skin.brand.fullName ?? skin.brand.name}
          </Link>
          {pickup && (
            <span className="order-last text-[13px] text-muted lg:order-none lg:text-[14px]">
              {pickup.address} · Open {pickup.hours}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5 text-[14px] text-accent-text lg:flex-row lg:flex-wrap lg:gap-7 lg:text-[15px] lg:font-semibold [&_a:hover]:text-text">
          <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener">
            WhatsApp · {contact.phone}
          </a>
          {store.telegramUrl && (
            <a href={store.telegramUrl} target="_blank" rel="noopener">
              Telegram channel
            </a>
          )}
          {tiktok && (
            <a href={tiktok} target="_blank" rel="noopener">
              TikTok · {socialHandle(tiktok)}
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener">
              Instagram · {socialHandle(instagram)}
            </a>
          )}
        </div>
        {skin.credit && <span className="label w-full text-[11px] text-muted lg:pt-2">Site by Sono Technologies</span>}
      </div>
    </footer>
  );
}
