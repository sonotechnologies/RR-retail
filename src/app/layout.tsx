import type { Metadata, Viewport } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartHydrator } from '@/components/cart/CartHydrator';
import { Toast } from '@/components/cart/Toast';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PromoBanner } from '@/components/layout/PromoBanner';
import { DesktopMotion } from '@/components/motion/DesktopMotion';
import { IntroCurtain, introScript } from '@/components/motion/IntroCurtain';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { RouteSignal } from '@/components/motion/TransitionLink';
import { getPromo } from '@/lib/menu';
import { toSite } from '@/lib/site';
import { getSkin } from '@/lib/skin';
import { fontVars } from './fonts';
import './globals.css';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const skin = getSkin();
  return {
    metadataBase: new URL(skin.seo.siteUrl),
    title: { default: skin.seo.title, template: `%s — ${skin.brand.name}` },
    description: skin.seo.description,
    applicationName: skin.brand.name,
    openGraph: {
      type: 'website',
      siteName: skin.brand.name,
      title: skin.seo.title,
      description: skin.seo.description,
      images: [{ url: skin.seo.ogImage, width: 1200, height: 630 }],
      locale: 'en_NG',
    },
    twitter: { card: 'summary_large_image' },
    robots: skin.seo.noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : undefined,
  };
}

export function generateViewport(): Viewport {
  const skin = getSkin();
  return { themeColor: skin.theme.colors.bg, colorScheme: skin.theme.mode };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const skin = getSkin();
  const site = toSite(skin);
  const promo = await getPromo();
  const fonts = fontVars(skin);
  const c = skin.theme.colors;
  const tokens = {
    '--bg': c.bg,
    '--surface': c.surface,
    '--text': c.text,
    '--muted': c.textMuted,
    '--accent': c.accent,
    '--ink': c.accentInk,
    '--line': c.line,
    '--rc': skin.theme.radius.card,
    '--rb': skin.theme.radius.button,
    ...fonts.style,
    colorScheme: skin.theme.mode,
  } as CSSProperties;

  return (
    <html lang="en-NG" className={fonts.className} style={tokens} data-skin={skin.id} suppressHydrationWarning>
      <head>
        {/* Decides before first paint whether the desktop intro plays (adds data-intro to <html>). */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-btn focus:bg-text focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        {/* Outside the page template so it covers the header (only shown when html[data-intro]). */}
        <IntroCurtain brand={skin.brand.name} />
        <MotionProvider>
          {promo && <PromoBanner text={promo.text} link={promo.link} />}
          <Header site={site} />
          <main id="main">{children}</main>
          <Footer skin={skin} />
          {skin.features.cart && (
            <>
              <CartDrawer site={site} />
              <Toast />
            </>
          )}
          <FloatingWhatsApp number={skin.contact.whatsapp} brand={skin.brand.name} />
        </MotionProvider>
        <CartHydrator skinId={skin.id} />
        <DesktopMotion />
        <RouteSignal />
      </body>
    </html>
  );
}
