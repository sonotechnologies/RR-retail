import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomMixForm } from '@/components/store/CustomMixForm';
import { formatNaira } from '@/lib/format';
import { getProducts } from '@/lib/products';
import { getStoreSkin } from '@/lib/skin';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const skin = getStoreSkin();
  return {
    title: 'Wholesale bundle prices',
    description: `Bundle prices for shop owners at ${skin.brand.name}. ${skin.store.wholesale.intro}`,
    alternates: { canonical: '/wholesale' },
  };
}

export default async function WholesalePage() {
  const skin = getStoreSkin();
  const { wholesale } = skin.store;
  if (!wholesale.enabled) notFound();
  const rows = (await getProducts()).filter((p) => p.wholesalePrice);
  const mins = rows.map((p) => p.wholesaleMin);
  const minLine = mins.length ? `Order at least one bundle (${Math.min(...mins)}${Math.max(...mins) > Math.min(...mins) ? `–${Math.max(...mins)}` : ''} pieces). More bundles, same per-piece price.` : 'Order at least one bundle.';
  const steps = [
    'Pick the item and colour. Sizes can be mixed inside a bundle.',
    minLine,
    `Pay, then pick up${skin.store.fulfilment.waybill ? ' or we waybill to your state' : ''}.`,
  ];

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-[22px] px-4 pt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8 lg:px-12 lg:pt-12">
      <div className="flex flex-col gap-[22px] lg:col-start-1 lg:row-start-1">
        <div>
          <span className="text-[11px] font-extrabold tracking-[0.14em] text-accent-text lg:text-[12px]">WHOLESALE</span>
          <h1 className="display mt-1.5 mb-1.5 text-[36px] leading-none lg:text-[60px]">Bundle prices for your shop</h1>
          <p className="text-[14px] leading-normal text-muted lg:text-[16px]">{wholesale.intro}</p>
        </div>
        <ol className="flex flex-col gap-2.5">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent text-[13px] font-extrabold text-accent-text">{i + 1}</span>
              <span className="pt-1 text-[14px] leading-[1.45] lg:text-[15px]">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full table-fixed border-collapse text-[13px] lg:text-[15px]">
            <thead className="bg-surface text-[11px] font-extrabold tracking-[0.04em] text-muted lg:text-[12px]">
              <tr>
                <th scope="col" className="px-3 py-2.5 text-left lg:px-5 lg:py-3.5">
                  ITEM
                </th>
                <th scope="col" className="w-[38px] px-1 py-2.5 text-right lg:w-[70px] lg:px-1.5 lg:py-3.5">
                  MIN
                </th>
                <th scope="col" className="w-[68px] px-1 py-2.5 text-right lg:w-[110px] lg:px-1.5 lg:py-3.5">
                  PER PC
                </th>
                <th scope="col" className="w-[90px] py-2.5 pr-3 pl-1 text-right lg:w-[140px] lg:px-5 lg:py-3.5">
                  BUNDLE
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.slug} className={`border-t border-line ${p.inStock ? '' : 'text-muted'}`}>
                  <td className="truncate px-3 py-3 font-semibold lg:px-5 lg:py-4">
                    <Link href={`/p/${p.slug}`} className="hover:text-accent">
                      {p.name}
                    </Link>
                    {!p.inStock && <span className="block text-[11px] font-bold text-muted">Sold out</span>}
                  </td>
                  <td className="px-1 py-3 text-right text-muted lg:px-1.5">{p.wholesaleMin}</td>
                  <td className="px-1 py-3 text-right font-extrabold text-accent-text lg:px-1.5">{formatNaira(p.wholesalePrice!)}</td>
                  <td className="py-3 pr-3 pl-1 text-right font-extrabold lg:px-5">{formatNaira(p.wholesalePrice! * p.wholesaleMin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {wholesale.sampleNote && <p className="text-[12px] text-muted">{wholesale.sampleNote}. Final prices confirmed on WhatsApp.</p>}
      </div>

      <section id="mix" className="flex scroll-mt-24 flex-col gap-3 rounded-card border border-line bg-surface p-[18px] lg:col-start-1 lg:row-start-2 lg:self-start lg:p-6">
        <h2 className="display text-[26px] lg:text-[32px]">Request a custom mix</h2>
        <p className="text-[13px] text-muted lg:text-[14px]">Mix items into one order. We confirm price and stock on WhatsApp.</p>
        <CustomMixForm items={rows.filter((p) => p.inStock).map((p) => ({ slug: p.slug, name: p.name, min: p.wholesaleMin }))} />
      </section>
    </div>
  );
}
