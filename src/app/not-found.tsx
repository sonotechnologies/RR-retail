import { ButtonLink } from '@/components/ui/Button';
import { getSkin } from '@/lib/skin';

export default function NotFound() {
  const store = getSkin().mode === 'store';
  return (
    <section className="wrap flex min-h-[70dvh] flex-col items-start justify-center gap-6 pt-24">
      <p className="label text-muted">404</p>
      <h1 className="t-h1 max-w-[16ch]">{store ? 'This page has sold out.' : 'This table doesn’t exist.'}</h1>
      <ButtonLink href={store ? '/shop' : '/'} variant="secondary">
        {store ? 'See what’s in stock' : 'Back to all kitchens'}
      </ButtonLink>
    </section>
  );
}
