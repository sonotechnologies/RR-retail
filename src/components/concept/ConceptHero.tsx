import Link from 'next/link';
import { vtName } from '@/components/motion/vt';
import { buttonClass } from '@/components/ui/Button';
import { OpenBadge } from '@/components/ui/OpenBadge';
import { Photo } from '@/components/ui/Photo';
import { inkOn } from '@/lib/format';
import { getStatus } from '@/lib/hours';
import type { Concept, Skin } from '@/skins/schema';

/** Hero in the concept's tint and photo: name, tagline, hours, "Reserve this room". */
export function ConceptHero({ skin, concept: c, reserveSection }: { skin: Skin; concept: Concept; reserveSection?: string }) {
  const tint = c.tint ?? skin.theme.colors.accent;
  const ink = inkOn(tint);
  const btnInk = ink === '#1E1B17' ? 'bg-coal text-paper' : 'bg-paper text-coal';
  const cta = reserveSection ? (
    <Link href={`/reserve?section=${c.slug}`} className={buttonClass('dark', 'lg', `${btnInk} lg:!h-[54px]`)}>
      Reserve this room
    </Link>
  ) : (
    <a href="#menu" className={buttonClass('dark', 'lg', `${btnInk} lg:!h-[54px]`)}>
      See the menu
    </a>
  );
  const badge = <OpenBadge variant="plain" hours={c.hours} initial={getStatus(c.hours)} className="text-[13px] lg:text-[14px]" />;

  return (
    <section className="grid lg:h-[640px] lg:grid-cols-[7fr_5fr]">
      <div className="relative h-[340px] overflow-hidden lg:h-auto" style={{ background: tint, viewTransitionName: vtName(c.slug) }}>
        <Photo src={c.heroImage} alt={c.name} priority sizes="(min-width:1024px) 58vw, 100vw" tint={tint} />
      </div>
      <div className="flex flex-col gap-3 px-5 pt-7 pb-8 lg:justify-end lg:gap-5 lg:px-14 lg:py-16" style={{ background: tint, color: ink }}>
        <p className="label font-semibold">
          {c.number} · {skin.brand.name}
        </p>
        <h1 className="t-display lg:!leading-[0.95]">{c.name}</h1>
        <p className="text-[16px] leading-normal lg:max-w-[36ch] lg:text-[17px] lg:leading-[1.6]">{c.intro ?? c.tagline}</p>
        <div className="mt-2 flex items-center justify-between gap-3 lg:flex-row-reverse lg:justify-end lg:gap-5">
          {badge}
          {cta}
        </div>
      </div>
    </section>
  );
}
