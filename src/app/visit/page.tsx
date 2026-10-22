import type { Metadata } from 'next';
import { FormPage } from '@/components/layout/FormPage';
import { Reveal } from '@/components/motion/Reveal';
import { telHref } from '@/components/sections/VisitBlock';
import { buttonClass } from '@/components/ui/Button';
import { ChatIcon } from '@/components/ui/icons';
import { JsonLd } from '@/components/ui/JsonLd';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { OpenBadge } from '@/components/ui/OpenBadge';
import { getStatus, weeklySummary } from '@/lib/hours';
import { visitJsonLd } from '@/lib/seo';
import { getFoodSkin } from '@/lib/skin';
import { waLink } from '@/lib/whatsapp';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Visit', alternates: { canonical: '/visit' } };

export default function VisitPage() {
  const skin = getFoodSkin();
  const { contact } = skin;
  const map = <MapEmbed src={contact.mapEmbedUrl} title={`Map: ${contact.address}`} dark={skin.theme.mode === 'dark'} className="h-[380px] !rounded-none border-x-0 border-t-0 lg:h-full lg:border-0" />;
  return (
    <>
      <JsonLd data={visitJsonLd(skin)} />
      <FormPage media={map} label="Visit" title={contact.address} lead={contact.directions}>
        <Reveal className="grid grid-cols-2 gap-2.5 lg:flex lg:gap-3">
          <a href={contact.mapsLink} target="_blank" rel="noopener" className={buttonClass('secondary', 'lg')}>
            Directions
          </a>
          <a href={telHref(contact.phone)} className={buttonClass('secondary', 'lg')}>
            Call
          </a>
        </Reveal>
        <Reveal index={1} className="flex flex-col">
          <h2 className="label pb-2 text-muted">Hours</h2>
          {skin.concepts.map((c) => (
            <div key={c.slug} className="flex flex-col gap-1 border-t border-line py-3.5 text-[14px] lg:flex-row lg:items-baseline lg:justify-between lg:gap-3 lg:text-[15px]">
              <span className="font-semibold">{c.name}</span>
              <span className="flex flex-col gap-1 text-muted lg:items-end">
                <span>{weeklySummary(c.hours)}</span>
                <OpenBadge variant="plain" hours={c.hours} initial={getStatus(c.hours)} className="text-[13px]" />
              </span>
            </div>
          ))}
        </Reveal>
        <a href={waLink(contact.whatsapp, `Hi ${skin.brand.name}, `)} target="_blank" rel="noopener" className={buttonClass('whatsapp', 'lg', 'w-full !h-[54px] text-[16px]')}>
          <ChatIcon width={18} height={18} />
          WhatsApp {contact.phone}
        </a>
      </FormPage>
    </>
  );
}
