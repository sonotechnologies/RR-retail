import { Reveal } from '@/components/motion/Reveal';
import { buttonClass } from '@/components/ui/Button';
import { ChatIcon } from '@/components/ui/icons';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { OpenBadge } from '@/components/ui/OpenBadge';
import { getStatus } from '@/lib/hours';
import { waLink } from '@/lib/whatsapp';
import type { Skin } from '@/skins/schema';

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;

/** Home "Visit us": map, address, today's hours per concept, call + WhatsApp. */
export function VisitBlock({ skin }: { skin: Skin }) {
  const { contact } = skin;
  return (
    <section className="section-y bg-surface px-5 lg:px-12">
      <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-2 lg:gap-16">
        <p className="label text-muted lg:hidden">Visit us</p>
        <MapEmbed src={contact.mapEmbedUrl} title={`Map: ${contact.address}`} dark={skin.theme.mode === 'dark'} className="h-[200px] lg:h-auto lg:min-h-[480px]" />
        <Reveal className="flex flex-col gap-6 lg:gap-7">
          <p className="label hidden text-muted lg:block">Visit us</p>
          <h2 className="t-h2">{contact.address}</h2>
          <ul className="flex flex-col text-[14px] lg:text-[15px]">
            {skin.concepts.map((c) => (
              <li key={c.slug} className="flex justify-between gap-3 border-t border-line py-3 lg:py-3.5">
                <span>
                  <span className="hidden lg:inline">{c.number} · </span>
                  {c.name}
                </span>
                <OpenBadge variant="plain" hours={c.hours} initial={getStatus(c.hours)} className="text-muted" />
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2.5 lg:flex lg:gap-3">
            <a href={telHref(contact.phone)} className={buttonClass('secondary', 'lg')}>
              Call<span className="hidden lg:inline"> {contact.phone}</span>
            </a>
            <a href={waLink(contact.whatsapp, `Hi ${skin.brand.name}, `)} target="_blank" rel="noopener" className={buttonClass('whatsapp', 'lg')}>
              <ChatIcon width={18} height={18} />
              WhatsApp<span className="hidden lg:inline"> us</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
