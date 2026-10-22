import { AddControl } from '@/components/cart/AddControl';
import { InCartRing } from '@/components/cart/InCartRing';
import { Reveal } from '@/components/motion/Reveal';
import { Photo } from '@/components/ui/Photo';
import { SectionHead } from '@/components/ui/SectionHead';
import { formatNaira } from '@/lib/format';
import { itemId } from '@/lib/menu';
import type { MenuItem, FoodSkin } from '@/skins/schema';

/** Featured menu items (featured = TRUE in the sheet), across all concepts. */
export function Signatures({ skin, items }: { skin: FoodSkin; items: MenuItem[] }) {
  if (!items.length) return null;
  const concepts = new Map(skin.concepts.map((c) => [c.slug, c]));
  return (
    <section className="wrap flex flex-col gap-7 pb-[72px] lg:gap-14 lg:py-[140px]">
      <SectionHead label="Signatures" title="What everyone orders." />
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14">
        {items.map((m, i) => {
          const c = concepts.get(m.concept)!;
          const id = itemId(m);
          const image = m.image ?? c.heroImage;
          return (
            <Reveal key={id} index={i % 3}>
              <article className="group flex flex-col gap-2.5 lg:gap-3.5" data-dish>
                <div className="relative aspect-square overflow-hidden rounded-card bg-line" data-fly>
                  <Photo src={image} alt={m.name} sizes="(min-width:1024px) 400px, 50vw" className="transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                  <InCartRing id={id} />
                </div>
                <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                  <div className="flex flex-col gap-2.5 lg:gap-1.5">
                    <span className="label text-[11px] text-muted lg:text-[12px]">{c.name}</span>
                    <h3 className="display min-h-11 text-[19px] leading-[1.15] lg:min-h-0 lg:text-[26px] lg:leading-[1.1]">{m.name}</h3>
                    <span className="hidden text-[16px] font-semibold lg:block">{formatNaira(m.price)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-semibold lg:hidden">{formatNaira(m.price)}</span>
                    <AddControl product={{ id, name: m.name, price: m.price, concept: m.concept, image }} available={m.available} />
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
