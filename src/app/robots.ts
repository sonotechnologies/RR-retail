import type { MetadataRoute } from 'next';
import { getSkin } from '@/lib/skin';

export default function robots(): MetadataRoute.Robots {
  const skin = getSkin();
  if (skin.seo.noindex) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${skin.seo.siteUrl.replace(/\/$/, '')}/sitemap.xml` };
}
