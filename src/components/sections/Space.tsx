import { Reveal } from '@/components/motion/Reveal';
import { Photo } from '@/components/ui/Photo';
import type { FoodSkin } from '@/skins/schema';

/** Asymmetric photo collage with the short story paragraph. */
export function Space({ skin }: { skin: FoodSkin }) {
  const [a, b, c] = skin.brand.storyImages;
  return (
    <section className="section-y bg-surface px-5 lg:px-12">
      <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
        <p className="label text-muted lg:hidden">The space</p>
        <div className="grid grid-cols-[1.3fr_1fr] grid-rows-[200px_150px] gap-2 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-[300px_260px] lg:gap-3">
          <Reveal variant="image" className="relative row-span-2 overflow-hidden rounded-card bg-line">
            <Photo src={a} alt="Inside the space" sizes="(min-width:1024px) 520px, 55vw" />
          </Reveal>
          <Reveal variant="image" index={1} className="relative overflow-hidden rounded-card bg-line">
            <Photo src={b} alt="" sizes="(min-width:1024px) 360px, 45vw" />
          </Reveal>
          <Reveal variant="image" index={2} className="relative overflow-hidden rounded-card bg-line lg:-mr-12">
            <Photo src={c} alt="" sizes="(min-width:1024px) 400px, 45vw" />
          </Reveal>
        </div>
        <Reveal className="flex max-w-[44ch] flex-col gap-6 lg:gap-5">
          <p className="label hidden text-muted lg:block">The space</p>
          <h2 className="t-h2">{skin.brand.storyTitle}</h2>
          <p className="text-muted">{skin.brand.story}</p>
        </Reveal>
      </div>
    </section>
  );
}
