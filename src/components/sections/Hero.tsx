import Link from 'next/link';
import type { CSSProperties } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import type { Skin } from '@/skins/schema';
import { HeroVideo } from './HeroVideo';

/** "Four kitchens. One address." → one rising line per sentence. */
const lines = (s: string) => s.split(/(?<=\.)\s+/).filter(Boolean);

export function Hero({ skin }: { skin: Skin }) {
  const { brand, features } = skin;
  const media = brand.heroMedia;
  const poster = media.type === 'video' ? (media.poster ?? media.src) : media.src;
  const headline = lines(brand.heroHeadline).map((l, i) => (
    <span key={i} className="block overflow-hidden pb-[0.06em]">
      <span className="hero-line" style={{ '--d': i } as CSSProperties}>
        {/* Keep hyphenated words ("3-in-1") on one line. */}
        {l.split(/(\S+-\S+)/).map((part, j) => (j % 2 ? <span key={j} className="whitespace-nowrap">{part}</span> : part))}
      </span>
    </span>
  ));
  const ctas = (
    <div className="mt-2 flex gap-2.5 lg:mt-0">
      {features.reserve && (
        <Link href="/reserve" className={buttonClass('primary', 'lg')}>
          Save me a seat
        </Link>
      )}
      <a href="#concepts" className={buttonClass('onImage', 'lg')}>
        View menus
      </a>
    </div>
  );

  return (
    <section className="relative flex h-[86svh] min-h-[560px] items-end overflow-hidden bg-[#3a2f26] text-paper lg:h-[100svh] lg:max-h-[1000px] lg:min-h-[680px]">
      <div className="absolute inset-0" data-parallax="18">
        <div className="hero-media absolute inset-0">
          <Photo src={poster} alt="" priority sizes="100vw" tint="#3a2f26" />
        </div>
        {media.type === 'video' && <HeroVideo src={media.src} />}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#00000033_0%,#0000_30%,#000000a6_100%)] lg:bg-[linear-gradient(180deg,#00000040_0%,#0000_30%,#00000099_100%)]" />

      {/* Mobile */}
      <div className="relative flex flex-col gap-4 px-5 pb-10 lg:hidden">
        <p className="label hero-sub">{brand.locationLine}</p>
        <h1 className="t-display">{headline}</h1>
        <p className="hero-sub max-w-[30ch] text-[16px] leading-normal opacity-90">{brand.heroSub}</p>
        <div className="hero-sub">{ctas}</div>
      </div>

      {/* Desktop */}
      <div className="relative hidden w-full grid-cols-[1fr_360px] items-end gap-12 px-12 pb-16 lg:grid">
        <h1 className="t-display max-w-[11ch]">{headline}</h1>
        <div className="hero-sub flex flex-col gap-5 pb-2.5">
          <p className="text-[17px] leading-[1.6] opacity-90">{brand.heroSub}</p>
          {ctas}
        </div>
      </div>
    </section>
  );
}
