import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

const base = 'inline-flex shrink-0 items-center justify-center rounded-full border font-bold whitespace-nowrap transition-colors';
const SIZE = {
  md: 'h-9 px-3.5 text-[13px] lg:h-10 lg:px-[18px] lg:text-[14px]',
  sm: 'h-8 px-3 text-[12px] lg:h-9 lg:text-[13px]',
};
export const chipClass = (on: boolean, size: keyof typeof SIZE = 'md') =>
  `${base} ${SIZE[size]} ${on ? 'border-text bg-text text-bg' : 'border-line text-text hover:border-text'}`;

/** Round filter chip. Selected: filled. */
export function Chip({ on, size = 'md', children, className = '', ...rest }: { on: boolean; size?: keyof typeof SIZE; children: ReactNode } & ComponentProps<'button'>) {
  return (
    <button type="button" aria-pressed={on} {...rest} className={`${chipClass(on, size)} ${className}`}>
      {children}
    </button>
  );
}

export function ChipLink({ on, children, ...rest }: { on: boolean; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link {...rest} aria-current={on ? 'page' : undefined} className={chipClass(on)}>
      {children}
    </Link>
  );
}
