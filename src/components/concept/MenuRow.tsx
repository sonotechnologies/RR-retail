import { AddControl } from '@/components/cart/AddControl';
import { Photo } from '@/components/ui/Photo';
import { Tag } from '@/components/ui/Tag';
import { formatNaira } from '@/lib/format';
import { itemId } from '@/lib/menu';
import type { MenuItem } from '@/skins/schema';

/** Editorial menu row: tags, name, two-line description, ₦ price, optional thumb, add/stepper.
 *  States: default, in cart (stepper), sold out (dimmed, struck price, "Back tomorrow"). */
export function MenuRow({ item: m }: { item: MenuItem }) {
  const id = itemId(m);
  const tags = m.available ? m.tags : [...m.tags.filter((t) => t.toLowerCase() !== 'sold out'), 'Sold out'];
  const price = <span className={m.available ? '' : 'line-through'}>{formatNaira(m.price)}</span>;
  return (
    <article className={`menu-row gap-x-3.5 border-t border-line py-4 lg:gap-x-[18px] lg:py-[22px] ${m.available ? '' : 'opacity-50'}`} data-dish>
      {m.image && (
        <div className="relative size-[84px] self-start overflow-hidden rounded-card bg-line [grid-area:t] lg:size-24" data-fly>
          <Photo src={m.image} alt={m.name} sizes="96px" />
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1.5 [grid-area:c]">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[16px] font-semibold lg:font-display lg:text-[22px] lg:leading-[1.15] lg:[font-weight:var(--fdw)]">{m.name}</h3>
          <span className="hidden shrink-0 text-[16px] font-semibold lg:block">{price}</span>
        </div>
        {m.description && <p className="clamp-2 text-[14px] leading-[1.45] text-muted lg:text-[15px] lg:leading-normal">{m.description}</p>}
        <span className="mt-0.5 text-[15px] font-semibold lg:hidden">{price}</span>
      </div>
      <div className="flex items-end justify-end pt-2.5 [grid-area:a] lg:justify-start lg:pt-1.5">
        <AddControl kind="row" product={{ id, name: m.name, price: m.price, concept: m.concept, image: m.image }} available={m.available} />
      </div>
    </article>
  );
}
