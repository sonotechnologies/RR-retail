import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { getSkin } from '@/lib/skin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const skin = getSkin();
  if (skin.seo.noindex) return [];
  const base = skin.seo.siteUrl.replace(/\/$/, '');
  if (skin.mode === 'store') {
    const products = await getProducts();
    const paths = [
      '',
      '/shop',
      ...skin.store.categories.map((c) => `/shop/${c.slug}`),
      ...products.map((p) => `/p/${p.slug}`),
      skin.store.wholesale.enabled && '/wholesale',
      skin.store.fulfilment.pickup && '/pickup',
    ].filter((p): p is string => typeof p === 'string');
    return paths.map((p) => ({ url: `${base}${p}`, changeFrequency: 'daily', priority: p === '' ? 1 : p.startsWith('/p/') ? 0.6 : 0.8 }));
  }
  const f = skin.features;
  const paths = [
    '',
    ...skin.concepts.map((c) => `/${c.slug}`),
    f.reserve && '/reserve',
    f.cakes && '/cakes',
    f.events && '/events',
    '/visit',
  ].filter((p): p is string => typeof p === 'string');
  return paths.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
}
