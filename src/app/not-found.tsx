import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70dvh] flex-col items-start justify-center gap-6 pt-24">
      <p className="label text-muted">404</p>
      <h1 className="t-h1 max-w-[16ch]">This table doesn&apos;t exist.</h1>
      <ButtonLink href="/" variant="secondary">
        Back to all kitchens
      </ButtonLink>
    </section>
  );
}
