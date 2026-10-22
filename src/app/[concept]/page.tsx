import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConceptHero } from '@/components/concept/ConceptHero';
import { MenuRow } from '@/components/concept/MenuRow';
import { MenuSpy } from '@/components/concept/MenuSpy';
import { Reveal } from '@/components/motion/Reveal';
import { TransitionLink } from '@/components/motion/TransitionLink';
import { JsonLd } from '@/components/ui/JsonLd';
import { Photo } from '@/components/ui/Photo';
import { getMenu, groupByCategory } from '@/lib/menu';
import { conceptJsonLd } from '@/lib/seo';
import { getConcept, getSkin } from '@/lib/skin';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ concept: string }> };

export function generateStaticParams() {
  return getSkin().concepts.map((c) => ({ concept: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skin = getSkin();
  const c = getConcept((await params).concept);
  if (!c) return {};
  return {
    title: `${c.name} in ${skin.seo.area}`,
    description: `${c.tagline}. Menu, prices and hours for ${c.name} at ${skin.brand.name}, ${skin.contact.address}.`,
    openGraph: { images: [{ url: c.heroImage }] },
    alternates: { canonical: `/${c.slug}` },
  };
}

export default async function ConceptPage({ params }: Props) {
  const skin = getSkin();
  const c = getConcept((await params).concept);
  if (!c) notFound();
  const menu = (await getMenu()).filter((m) => m.concept === c.slug);
  const groups = groupByCategory(menu, c.categories);
  const reserveSection = skin.features.reserve ? skin.reserve.sections.find((s) => s === c.name || s === c.shortName) : undefined;
  const others = skin.concepts.filter((o) => o.slug !== c.slug);

  return (
    <>
      <JsonLd data={conceptJsonLd(skin, c, groups)} />
      <ConceptHero skin={skin} concept={c} reserveSection={reserveSection} />

      {groups.length > 0 ? (
        <MenuSpy categories={groups.map((g) => g.name)}>
          <div className="pb-2 lg:mx-auto lg:max-w-[1280px] lg:px-0 lg:pb-10 max-lg:px-5">
            {groups.map((g) => (
              <section key={g.name} data-cat className="flex flex-col pt-9 pb-2 lg:grid lg:grid-cols-[3fr_9fr] lg:gap-12 lg:pt-[72px] lg:pb-0">
                <div className="flex items-baseline justify-between pb-3 lg:flex-col lg:justify-start lg:gap-2">
                  <h2 className="t-h2 lg:!leading-none">{g.name}</h2>
                  <span className="text-[12px] text-muted lg:text-[13px]">
                    {g.items.length} {g.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-12">
                  {g.items.map((m) => (
                    <MenuRow key={m.name} item={m} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </MenuSpy>
      ) : (
        <p className="wrap py-16 text-muted">The menu is on its way. Ask us on WhatsApp what&apos;s fresh today.</p>
      )}

      {c.gallery.length > 0 && (
        <div className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-5 pt-14 lg:gap-3 lg:px-12 lg:pt-[100px]">
          {c.gallery.map((src, i) => (
            <Reveal key={src + i} index={i} variant="image" className="relative h-[280px] w-[220px] shrink-0 snap-start overflow-hidden rounded-card bg-line lg:h-[400px] lg:w-[320px]">
              <Photo src={src} alt="" sizes="(min-width:1024px) 320px, 220px" />
            </Reveal>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <section className="flex flex-col px-5 pt-14 pb-24 lg:mx-auto lg:grid lg:max-w-[1280px] lg:grid-cols-[3fr_9fr] lg:gap-12 lg:px-0 lg:pt-[100px] lg:pb-[140px]">
          <p className="label pb-3 text-muted lg:pt-6">Also under this roof</p>
          <div className="flex flex-col">
            {others.map((o) => (
              <TransitionLink key={o.slug} href={`/${o.slug}`} className="group flex items-baseline gap-3.5 border-t border-line py-[18px] lg:gap-5 lg:py-[22px]">
                <span className="text-[12px] font-bold tracking-[0.12em]" style={{ color: o.tint ?? skin.theme.colors.accent }}>
                  {o.number}
                </span>
                <span className="display flex-1 text-[26px] leading-none lg:text-[44px]">{o.name}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 lg:text-[24px]">→</span>
              </TransitionLink>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
