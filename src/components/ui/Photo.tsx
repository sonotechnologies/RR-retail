import Image, { type ImageProps } from 'next/image';
import { blurData } from '@/lib/format';

/** next/image with a tinted blur placeholder. Always `fill`: size it with the parent box. */
export function Photo({ tint, alt, sizes, className = '', ...rest }: Omit<ImageProps, 'fill' | 'placeholder' | 'blurDataURL'> & { tint?: string }) {
  return (
    <Image
      fill
      alt={alt}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={blurData(tint)}
      className={`object-cover ${className}`}
      {...rest}
    />
  );
}
