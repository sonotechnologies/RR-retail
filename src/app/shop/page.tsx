import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopView } from '@/components/store/ShopView';
import { getProducts } from '@/lib/products';
import { getStoreSkin } from '@/lib/skin';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const skin = getStoreSkin();
  return {
    title: 'Shop all',
    description: `Everything in stock at ${skin.brand.name}, with retail and wholesale prices. Order on WhatsApp.`,
    alternates: { canonical: '/shop' },
  };
}

export default async function ShopPage() {
  getStoreSkin();
  const products = await getProducts();
  return (
    // useSearchParams (?q=) needs a Suspense boundary for static rendering.
    <Suspense>
      <ShopView products={products} category={null} />
    </Suspense>
  );
}
