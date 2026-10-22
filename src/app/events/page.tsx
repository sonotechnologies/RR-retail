import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventForm } from '@/components/forms/EventForm';
import { FormPage } from '@/components/layout/FormPage';
import { Reveal } from '@/components/motion/Reveal';
import { Counter } from '@/components/ui/Counter';
import { Photo } from '@/components/ui/Photo';
import { lagosToday } from '@/lib/dates';
import { getSkin } from '@/lib/skin';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Events & private hire', alternates: { canonical: '/events' } };

export default function EventsPage() {
  const skin = getSkin();
  if (!skin.features.events) notFound();
  const { spaces, occasions, budgets } = skin.events;
  const imgs = spaces.map((s) => s.image).slice(0, 3);
  while (imgs.length < 3) imgs.push(skin.brand.storyImages[imgs.length]);

  const collage = (
    <div className="grid h-[312px] grid-cols-[1.4fr_1fr] grid-rows-2 gap-1.5 p-1.5 lg:h-full lg:gap-2 lg:p-2">
      {imgs.map((src, i) => (
        <div key={i} className={`relative overflow-hidden rounded-card bg-line ${i === 0 ? 'row-span-2' : ''}`}>
          <Photo src={src} alt={spaces[i]?.name ?? ''} priority={i === 0} sizes="(min-width:1024px) 30vw, 60vw" />
        </div>
      ))}
    </div>
  );

  return (
    <FormPage media={collage} label="Events & private hire" title="Take over a room, or the whole house.">
      <Reveal>
        <table className="w-full text-[15px]">
          <thead>
            <tr className="label text-[11px] text-muted">
              <th className="pb-2 text-left font-normal">Area</th>
              <th className="w-16 pb-2 text-right font-normal">Seated</th>
              <th className="w-[72px] pb-2 text-right font-normal">Standing</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((s) => (
              <tr key={s.name} className="border-t border-line">
                <td className="py-3.5 font-semibold">{s.name}</td>
                <td className="py-3.5 text-right">{s.seated === null ? '—' : <Counter value={s.seated} />}</td>
                <td className="py-3.5 text-right">
                  <Counter value={s.standing} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <EventForm
        brand={skin.brand.name}
        whatsapp={skin.contact.whatsapp}
        occasions={occasions}
        spaces={spaces.map((s) => s.name)}
        budgets={budgets}
        serverToday={lagosToday()}
      />
    </FormPage>
  );
}
