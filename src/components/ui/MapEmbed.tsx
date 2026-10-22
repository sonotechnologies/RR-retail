/** Google Maps embed, lazy-loaded; inverted for dark skins so it sits in the palette. */
export function MapEmbed({ src, title, dark, className = '' }: { src: string; title: string; dark: boolean; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-line bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_10px)] ${className}`}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
        style={{ filter: dark ? 'grayscale(.3) invert(.92) hue-rotate(180deg) contrast(.9)' : 'grayscale(.25) sepia(.08)' }}
      />
    </div>
  );
}
