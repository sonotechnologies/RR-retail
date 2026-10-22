import { SectionHead } from '@/components/ui/SectionHead';
import { socialHandle } from '@/lib/site';
import type { FoodSkin } from '@/skins/schema';
import { VideoTile } from './VideoTile';

/** Seen on TikTok: curated vertical video posters in a scroll row; embeds load on tap. */
export function Social({ skin }: { skin: FoodSkin }) {
  if (!skin.features.socialEmbeds || !skin.socialEmbeds.length) return null;
  const tiktok = skin.contact.socials.tiktok;
  const platform = skin.socialEmbeds.every((e) => e.platform === 'instagram') ? 'Instagram' : 'TikTok';
  return (
    <section className="section-y flex flex-col gap-6 lg:gap-12">
      <SectionHead
        className="wrap"
        label={`Seen on ${platform}`}
        title="As filmed by you."
        aside={
          tiktok && (
            <a href={tiktok} target="_blank" rel="noopener" className="border-b border-current pb-[3px] text-[14px] font-semibold">
              {platform} {socialHandle(tiktok)}
            </a>
          )
        }
      />
      <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5 lg:gap-4 lg:px-20">
        {skin.socialEmbeds.map((e, i) => (
          <VideoTile key={i} embed={e} label={`${skin.brand.name} on ${platform}, video ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
