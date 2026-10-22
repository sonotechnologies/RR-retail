import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ReserveForm } from '@/components/forms/ReserveForm';
import { FormPage } from '@/components/layout/FormPage';
import { lagosToday } from '@/lib/dates';
import { getSkin } from '@/lib/skin';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Reserve a table', alternates: { canonical: '/reserve' } };

export default function ReservePage() {
  const skin = getSkin();
  if (!skin.features.reserve) notFound();
  const sectionBySlug = Object.fromEntries(
    skin.concepts.flatMap((c) => {
      const s = skin.reserve.sections.find((x) => x === c.name || x === c.shortName);
      return s ? [[c.slug, s]] : [];
    }),
  );
  return (
    <FormPage image={skin.reserve.image} label="Reserve" title="Save me a seat.">
      <Suspense>
        <ReserveForm
          brand={skin.brand.name}
          whatsapp={skin.contact.whatsapp}
          slots={skin.reserve.slots}
          maxGuests={skin.reserve.maxGuests}
          sections={skin.reserve.sections}
          sectionBySlug={sectionBySlug}
          serverToday={lagosToday()}
        />
      </Suspense>
    </FormPage>
  );
}
