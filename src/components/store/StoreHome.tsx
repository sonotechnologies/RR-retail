import Link from 'next/link';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { VideoTile } from '@/components/sections/VideoTile';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Photo } from '@/components/ui/Photo';
import { TelegramIcon } from '@/components/ui/icons';
import { socialHandle } from '@/lib/site';
import type { StoreProduct } from '@/lib/store';
import type { StoreSkin } from '@/skins/schema';
import { ProductCard } from './ProductCard';

const TINT = '#1B1917';
const h2 = 'display text-[28px] leading-[1.1] lg:text-[40px]';

/** Store home: hero, trust strip, just restocked, categories, best sellers, how to order,
 *  wholesale banner, Telegram, TikTok + customer proof, pickup card. */
export function StoreHome({ skin, products }: { skin: StoreSkin; products: StoreProduct[] }) {
  const { brand, store } = skin;
  const inStock = products.filter((p) => p.inStock);
  const recent = inStock.filter((p) => p.recent).sort((a, b) => (b.restockedAt ?? '').localeCompare(a.restockedAt ?? '') || a.index - b.index);
  // Nothing restocked this week: show the newest-tagged items instead of an empty row.
  const restocked = (recent.length ? recent : inStock.filter((p) => p.badge === 'New' || p.badge === 'Restocked')).slice(0, 10);
  const featured = products.filter((p) => p.featured);
  const best = (featured.length ? featured : products).slice(0, 8);
  const pickup = store.fulfilment.pickup;

  return (
    <>
      <Hero skin={skin} />

      {brand.trustLine.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line px-4 py-3 text-[12px] font-semibold whitespace-nowrap text-muted lg:hidden">
          {brand.trustLine.map((t, i) => (
            <span key={t} className="flex gap-2">
              {i > 0 && <span className="text-soldout">·</span>}
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mx-auto flex max-w-[1440px] flex-col lg:px-12">
        {restocked.length > 0 && (
          <section className="pt-[26px] lg:pt-0">
            <Head title="Just restocked" link={{ href: '/shop', label: 'See all' }} />
            <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lg:gap-x-[18px] lg:gap-y-7 lg:overflow-visible lg:px-0">
              {restocked.map((p, i) => (
                // Desktop: one row of five.
                <div key={p.slug} className={`contents ${i >= 5 ? 'lg:hidden' : ''}`}>
                  <ProductCard product={p} variant="row" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-4 pt-[30px] lg:px-0 lg:pt-[72px]">
          <h2 className={`${h2} mb-3 lg:mb-[18px]`}>Shop by category</h2>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-3.5">
            {store.categories.map((c, i) => (
              <Reveal key={c.slug} index={i} className={i === 0 ? 'col-span-2 lg:col-span-1' : ''}>
                <Link
                  href={`/shop/${c.slug}`}
                  className={`group relative block overflow-hidden rounded-card bg-surface transition-transform active:scale-[0.98] lg:aspect-[3/4] ${i === 0 ? 'aspect-[2/1]' : 'aspect-square'}`}
                >
                  <Photo src={c.image} alt="" tint={TINT} sizes={i === 0 ? '(min-width:1024px) 20vw, 100vw' : '(min-width:1024px) 20vw, 50vw'} className="transition-transform duration-500 lg:group-hover:scale-105" />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(15_14_13/.9))] transition-colors lg:group-hover:bg-accent/10" />
                  <span className="display absolute bottom-2.5 left-3 text-[24px] lg:bottom-3.5 lg:left-4 lg:text-[30px]">{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {best.length > 0 && (
          <section className="px-4 pt-[30px] lg:px-0 lg:pt-[72px]">
            <h2 className={`${h2} mb-3 lg:mb-[18px]`}>Best sellers</h2>
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-4 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:gap-x-[18px] lg:gap-y-7">
              {best.map((p, i) => (
                <div key={p.slug} className={i >= 6 ? 'max-lg:hidden' : ''}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-3.5 px-4 pt-[34px] lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] lg:gap-[18px] lg:px-0 lg:pt-20">
          <Reveal className="flex flex-col gap-3.5 rounded-card border border-line bg-surface p-5 lg:gap-[18px] lg:rounded-[14px] lg:p-[30px]">
            <h2 className="display text-[26px] lg:text-[32px]">How to order</h2>
            {[
              ['Add to bag', 'Pick size, colour, retail or bundle.'],
              ['Send on WhatsApp', 'Your full order goes to us in one message.'],
              ['Pick up or get it delivered', 'Pickup station, Lagos delivery or waybill.'],
            ].map(([t, d], i) => (
              <div key={t} className="flex items-center gap-3 lg:gap-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-extrabold text-ink lg:size-9">{i + 1}</span>
                <div className="leading-snug">
                  <div className="text-[15px] font-bold lg:text-[16px]">{t}</div>
                  <div className="text-[13px] text-muted lg:text-[14px]">{d}</div>
                </div>
              </div>
            ))}
          </Reveal>

          {store.wholesale.enabled && (
            <Reveal index={1}>
              <Link href="/wholesale" className="flex h-full flex-col justify-between gap-2.5 rounded-card bg-accent px-5 py-[22px] text-ink lg:gap-5 lg:rounded-[14px] lg:p-[30px]">
                <span className="text-[11px] font-extrabold tracking-[0.14em] lg:text-[12px] lg:tracking-[0.16em]">WHOLESALE</span>
                <span className="display text-[30px] leading-none font-bold lg:text-[40px]">{store.copy.wholesaleBanner}</span>
                <span className="mt-1 self-start rounded-full bg-bg px-[18px] py-2.5 text-[14px] font-bold text-text lg:px-[22px] lg:py-3 lg:text-[15px]">See bundle prices →</span>
              </Link>
            </Reveal>
          )}

          {store.telegramUrl && (
            <Reveal index={2} className="flex flex-col justify-between gap-3.5 rounded-card border border-line bg-surface p-5 lg:gap-5 lg:rounded-[14px] lg:p-[30px]">
              <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-tg text-white lg:size-[52px]">
                  <TelegramIcon width={22} height={22} />
                </span>
                <span className="text-[16px] leading-[1.3] font-bold lg:text-[22px]">{store.copy.telegram}</span>
              </div>
              <a href={store.telegramUrl} target="_blank" rel="noopener" className="flex h-12 items-center justify-center rounded-full bg-tg text-[15px] font-extrabold text-white lg:h-[52px]">
                Join the Telegram channel
              </a>
            </Reveal>
          )}
        </div>

        {(skin.socialEmbeds.length > 0 || store.proofImages.length > 0) && (
          <section className="px-4 pt-[30px] lg:px-0 lg:pt-20">
            <div className="mb-3 flex items-baseline justify-between lg:mb-[18px]">
              <h2 className={h2}>Seen on TikTok</h2>
              {skin.contact.socials.tiktok && (
                <a href={skin.contact.socials.tiktok} target="_blank" rel="noopener" className="text-[13px] font-bold text-accent-text hover:text-text lg:text-[14px]">
                  {socialHandle(skin.contact.socials.tiktok)}
                  <span className="hidden lg:inline"> →</span>
                </a>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5 lg:grid-cols-6 lg:gap-3">
              {skin.socialEmbeds.slice(0, 6).map((e, i) => (
                <VideoTile key={i} embed={e} label={`${brand.name} on TikTok, video ${i + 1}`} className="w-full !rounded-[8px] lg:!rounded-card" />
              ))}
            </div>
            {store.proofImages.length > 0 && (
              <>
                <p className="mt-5 mb-2.5 text-[13px] font-bold text-muted lg:mt-6">What customers send us</p>
                <div className="no-scrollbar flex gap-2.5 overflow-x-auto lg:grid lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-3">
                  {store.proofImages.map((src, i) => (
                    <div key={src} className="relative aspect-[9/16] w-[150px] shrink-0 overflow-hidden rounded-card border border-line bg-surface lg:aspect-[3/4] lg:w-auto">
                      <Photo src={src} alt={`Customer chat ${i + 1}`} tint={TINT} sizes="(min-width:1024px) 25vw, 150px" className="object-top" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {pickup && (
          <section className="px-4 pt-[30px] lg:px-0 lg:pt-20">
            <div className="grid overflow-hidden rounded-card border border-line bg-surface lg:grid-cols-2 lg:rounded-[14px]">
              {pickup.mapEmbedUrl && (
                <MapEmbed src={pickup.mapEmbedUrl} title={`Map: ${pickup.address}`} dark={skin.theme.mode === 'dark'} className="aspect-video !rounded-none border-0 lg:order-2 lg:aspect-auto lg:min-h-[300px]" />
              )}
              <div className="flex flex-col gap-1.5 px-[18px] pt-4 pb-[18px] lg:justify-center lg:gap-3 lg:p-9">
                <span className="text-[11px] font-extrabold tracking-[0.14em] text-accent-text lg:text-[12px] lg:tracking-[0.16em]">PICKUP STATION</span>
                <span className="text-[16px] font-bold lg:display lg:text-[36px] lg:leading-[1.05]">{pickup.address}</span>
                <span className="text-[14px] text-muted lg:text-[16px]">
                  Open {pickup.hours}
                  {pickup.landmark && ` · ${pickup.landmark}`}
                </span>
                <span className="hidden text-[14px] text-muted lg:block">Lagos delivery and waybill outside Lagos. {store.fulfilment.feeNote}.</span>
                <Link href="/pickup" className="mt-2 flex h-11 items-center self-start rounded-full border border-text px-5 text-[14px] font-bold transition-colors hover:bg-text hover:text-bg">
                  Get directions
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Head({ title, link }: { title: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-baseline justify-between px-4 pb-3 lg:px-0 lg:pb-[18px]">
      <h2 className={h2}>{title}</h2>
      {link && (
        <Link href={link.href} className="text-[13px] font-bold text-accent-text hover:text-text lg:text-[14px]">
          {link.label}
          <span className="hidden lg:inline"> →</span>
        </Link>
      )}
    </div>
  );
}

function Hero({ skin }: { skin: StoreSkin }) {
  const { brand, store } = skin;
  const ctas = (big: boolean): ReactNode => (
    <div className={`flex gap-2.5 ${big ? 'flex-wrap gap-3' : 'mt-1'}`}>
      <Link
        href="/shop"
        className={`flex items-center justify-center rounded-full bg-accent font-extrabold text-ink transition-[filter] hover:brightness-110 ${big ? 'h-[54px] px-[30px] text-[16px]' : 'h-12 flex-1 text-[15px]'}`}
      >
        Shop now
      </Link>
      {store.wholesale.enabled && (
        <Link
          href="/wholesale"
          className={`flex items-center justify-center rounded-full border border-text font-bold transition-colors hover:bg-text hover:text-bg ${big ? 'h-[54px] px-[30px] text-[16px]' : 'h-12 flex-1 text-[15px]'}`}
        >
          Buy wholesale
        </Link>
      )}
    </div>
  );
  return (
    <>
      {/* Mobile: full-bleed 4:5 photo, copy over the bottom gradient. */}
      <section className="relative aspect-[4/5] max-h-[calc(100svh-57px)] min-h-[440px] w-full overflow-hidden bg-surface lg:hidden">
        <div className="hero-media absolute inset-0">
          <Photo src={brand.heroImage} alt="" priority tint={TINT} sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(15_14_13/0)_35%,rgb(15_14_13/.95)_100%)]" />
        <div className="absolute inset-x-[18px] bottom-[22px] flex flex-col gap-3">
          <h1 className="display text-[44px] leading-[0.98] tracking-[-0.01em] text-balance">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line">{brand.heroHeadline}</span>
            </span>
          </h1>
          <p className="hero-sub text-[15px] font-medium">{brand.heroSub}</p>
          <div className="hero-sub">{ctas(false)}</div>
        </div>
      </section>

      {/* Desktop: copy left, photo right with slow parallax. */}
      <section className="mx-auto hidden max-w-[1440px] grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-12 px-12 pt-12 pb-14 lg:grid">
        <div className="flex flex-col gap-[22px]">
          <span className="hero-sub text-[12px] font-extrabold tracking-[0.16em] text-accent-text uppercase">{brand.locationLine}</span>
          <h1 className="display text-[clamp(56px,6vw,92px)] leading-[0.95] tracking-[-0.01em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line">{brand.heroHeadline}</span>
            </span>
          </h1>
          <p className="hero-sub text-[19px] font-medium">{brand.heroSub}</p>
          <div className="hero-sub">{ctas(true)}</div>
          {brand.trustLine.length > 0 && (
            <div className="hero-sub flex flex-wrap gap-7 border-t border-line pt-[18px] text-[14px] font-semibold text-muted">
              {brand.trustLine.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-[14px] bg-surface">
          <div className="absolute inset-x-0 -inset-y-[8%]" data-parallax="8">
            <div className="hero-media absolute inset-0">
              <Photo src={brand.heroImageWide ?? brand.heroImage} alt="" tint={TINT} sizes="55vw" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
