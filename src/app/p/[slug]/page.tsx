import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/store/ProductCard';
import { ProductView } from '@/components/store/ProductView';
import { JsonLd } from '@/components/ui/JsonLd';
import { getProduct, getProducts } from '@/lib/products';
import { getSkin, getStoreSkin } from '@/lib/skin';
import { productJsonLd } from '@/lib/seo';

export const revalidate = 300;
// New rows in the sheet get a page on first visit (then cached for 5 minutes).
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (getSkin().mode !== 'store') return [];
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skin = getStoreSkin();
  const p = await getProduct((await params).slug);
  if (!p) return {};
  const ws = p.wholesalePrice ? `, wholesale ₦${p.wholesalePrice.toLocaleString('en-NG')}/pc (min ${p.wholesaleMin})` : '';
  return {
    title: p.name,
    description: `${p.name} at ${skin.brand.name}: ₦${p.retailPrice.toLocaleString('en-NG')}${ws}. Order on WhatsApp, pick up or get it delivered.`,
    openGraph: { images: p.images[0] ? [{ url: p.images[0] }] : undefined },
    alternates: { canonical: `/p/${p.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const skin = getStoreSkin();
  const { slug } = await params;
  const all = await getProducts();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  // Same category first, then anything in a similar price range.
  const related = [
    ...all.filter((x) => x.slug !== p.slug && x.inStock && x.category === p.category),
    ...all.filter((x) => x.slug !== p.slug && x.inStock && x.category !== p.category && Math.abs(x.retailPrice - p.retailPrice) <= 3000),
  ].slice(0, 4);

  return (
    <>
      <JsonLd data={productJsonLd(skin, p)} />
      <ProductView product={p} />
      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 pt-[30px] lg:px-12 lg:pt-20">
          <h2 className="display mb-3 text-[24px] lg:mb-[18px] lg:text-[40px]">{skin.store.copy.relatedTitle}</h2>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4 lg:grid-cols-4 lg:gap-x-[18px] lg:gap-y-7">
            {related.map((r) => (
              <ProductCard key={r.slug} product={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
