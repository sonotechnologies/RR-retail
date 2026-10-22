import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CakeForm } from '@/components/forms/CakeForm';
import { FormPage } from '@/components/layout/FormPage';
import { lagosToday } from '@/lib/dates';
import { getSkin } from '@/lib/skin';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Cakes & bulk orders', alternates: { canonical: '/cakes' } };

export default function CakesPage() {
  const skin = getSkin();
  if (!skin.features.cakes) notFound();
  const { cakes } = skin;
  return (
    <FormPage image={skin.emptyCartImage} label="Cakes & bulk orders" title="Tell us what you're celebrating." lead={cakes.leadTime}>
      <CakeForm
        brand={skin.brand.name}
        whatsapp={skin.contact.whatsapp}
        types={cakes.types}
        sizes={cakes.sizes}
        flavours={cakes.flavours}
        budgets={cakes.budgets}
        serverToday={lagosToday()}
      />
    </FormPage>
  );
}
