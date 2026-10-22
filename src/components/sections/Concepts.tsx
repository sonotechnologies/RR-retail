import { TransitionLink } from '@/components/motion/TransitionLink';
import { vtName } from '@/components/motion/vt';
import { OpenBadge } from '@/components/ui/OpenBadge';
import { Photo } from '@/components/ui/Photo';
import { SectionHead } from '@/components/ui/SectionHead';
import { getStatus } from '@/lib/hours';
import type { Concept, Skin } from '@/skins/schema';
import { ConceptCarousel } from './ConceptCarousel';

/** Numbered editorial cards. Mobile: scroll-snap carousel; desktop: grid, pinned horizontal scroll when enhanced. */
export function Concepts({ skin }: { skin: Skin }) {
  return (
    <section id="concepts" className="scroll-mt-16 overflow-x-clip pt-[72px] pb-[72px] lg:pt-[140px] lg:pb-0" data-pin-section>
      <div className="wrap flex flex-col gap-7 lg:gap-14 lg:pb-[140px]">
        <SectionHead
          label="The house"
          title="Pick a room, any room."
          aside={<p className="max-w-[44ch] text-[17px] text-muted">Each kitchen keeps its own menu and hours. Order from all of them in one basket.</p>}
        />
        <ConceptCarousel>
          {skin.concepts.map((c) => (
            <ConceptCard key={c.slug} concept={c} accent={skin.theme.colors.accent} />
          ))}
        </ConceptCarousel>
      </div>
    </section>
  );
}

function ConceptCard({ concept: c, accent }: { concept: Concept; accent: string }) {
  const tint = c.tint ?? accent;
  return (
    <TransitionLink
      href={`/${c.slug}`}
      className="group flex w-[272px] flex-col gap-3.5 lg:w-auto lg:gap-4"
      data-cursor="view"
      aria-label={`${c.name}: ${c.tagline}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-card" style={{ background: tint, viewTransitionName: vtName(c.slug) }}>
        <Photo
          src={c.heroImage}
          alt=""
          tint={tint}
          sizes="(min-width:1024px) 30vw, 272px"
          className="transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.06]"
        />
        <OpenBadge hours={c.hours} initial={getStatus(c.hours)} className="absolute top-3 left-3 lg:top-3.5 lg:left-3.5" />
        <span className="absolute right-3 bottom-3 flex size-14 scale-75 items-center justify-center rounded-full bg-bg text-[12px] font-bold text-text opacity-0 transition-[opacity,transform] duration-300 max-lg:hidden [html:not(.has-cursor)_.group:hover_&]:scale-100 [html:not(.has-cursor)_.group:hover_&]:opacity-100">
          View
        </span>
      </div>
      <div className="flex items-baseline gap-3 border-t border-line pt-3 transition-colors group-hover:border-text lg:gap-3.5 lg:pt-3.5">
        <span className="text-[12px] font-bold tracking-[0.12em]" style={{ color: tint }}>
          {c.number}
        </span>
        <div className="flex flex-col gap-1">
          <span className="display text-[24px] leading-[1.1] lg:text-[28px]">
            {c.name}
            <span className="inline-block -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"> →</span>
          </span>
          <span className="text-[14px] text-muted lg:text-[15px]">{c.tagline}</span>
        </div>
      </div>
    </TransitionLink>
  );
}
