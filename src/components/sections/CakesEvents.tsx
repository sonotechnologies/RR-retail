import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { Photo } from '@/components/ui/Photo';
import type { FoodSkin } from '@/skins/schema';

/** Two side-by-side panels linking to the cake and events forms. */
export function CakesEvents({ skin }: { skin: FoodSkin }) {
  const panels = [
    skin.features.cakes && { href: '/cakes', label: 'Cakes & bulk orders', title: 'Birthdays, trays, pastry boxes →', image: skin.emptyCartImage },
    skin.features.events && { href: '/events', label: 'Events & private hire', title: 'Take over a room →', image: skin.events.spaces[0]?.image ?? skin.brand.storyImages[0] },
  ].filter(Boolean) as Array<{ href: string; label: string; title: string; image: string }>;
  if (!panels.length) return null;
  return (
    <section className="wrap grid gap-3.5 pb-[72px] lg:grid-cols-2 lg:gap-6 lg:pb-[140px]">
      {panels.map((p, i) => (
        <Reveal key={p.href} index={i} className={i === 1 ? 'lg:mt-20' : ''}>
          <Link href={p.href} className="group relative flex h-[260px] items-end overflow-hidden rounded-card bg-[#3a2f26] p-5 text-paper lg:h-[560px] lg:p-10" data-cursor="view">
            <Photo src={p.image} alt="" sizes="(min-width:1024px) 50vw, 100vw" className="transition-transform duration-[900ms] ease-out-expo group-hover:scale-105" />
            <span className="absolute inset-0 bg-[linear-gradient(#0000_40%,#0009)] lg:bg-[linear-gradient(#0000_45%,#000a)]" />
            <span className="relative flex flex-col gap-1.5 lg:gap-2.5">
              <span className="label">{p.label}</span>
              <span className="display text-[28px] leading-[1.05] lg:text-[44px]">{p.title}</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
