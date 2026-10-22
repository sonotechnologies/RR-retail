import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ShopView } from '@/components/store/ShopView';
import { getProducts } from '@/lib/products';
import { getSkin, getStoreSkin } from '@/lib/skin';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  const skin = getSkin();
  return skin.mode === 'store' ? skin.store.categories.map((c) => ({ category: c.slug })) : [];
}

const findCategory = async (params: Props['params']) => {
  const slug = (await params).category;
  return getStoreSkin().store.categories.find((c) => c.slug === slug);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skin = getStoreSkin();
  const c = await findCategory(params);
  if (!c) return {};
  return {
    title: `${c.bundles ? 'Wholesale bundles' : c.name} in ${skin.seo.area}`,
    description: `${c.name} at ${skin.brand.name}: prices for retail and wholesale bundles. Order on WhatsApp.`,
    openGraph: { images: [{ url: c.image }] },
    alternates: { canonical: `/shop/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const skin = getStoreSkin();
  const c = await findCategory(params);
  if (!c) notFound();
  const all = await getProducts();
  const products = c.bundles ? all.filter((p) => p.wholesalePrice) : all.filter((p) => p.category === c.slug);
  const mins = [...new Set(products.map((p) => p.wholesaleMin))].sort((a, b) => a - b);
  const range = mins.length > 1 ? `${mins[0]}–${mins[mins.length - 1]}` : `${mins[0] ?? skin.store.wholesale.defaultMin}`;
  return (
    <Suspense>
      <ShopView products={products} category={{ slug: c.slug, name: c.name, bundles: c.bundles }} countNote={c.bundles ? ` · bundles of ${range} pieces` : undefined} />
    </Suspense>
  );
}
