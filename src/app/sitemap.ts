import type { MetadataRoute } from 'next';
import { getSkin } from '@/lib/skin';

export default function sitemap(): MetadataRoute.Sitemap {
  const skin = getSkin();
  if (skin.seo.noindex) return [];
  const base = skin.seo.siteUrl.replace(/\/$/, '');
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
