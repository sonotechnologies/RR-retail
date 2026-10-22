import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { ChatIcon } from './icons';

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'onImage' | 'dark';
type Size = 'md' | 'lg';

// States from the component sheet: hover lifts + glows, pressed scales .97, loading spins, disabled greys.
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink hover:brightness-[1.08] hover:shadow-[0_6px_14px_-6px_var(--accent)] active:brightness-90',
  secondary: 'border border-text text-text hover:bg-text hover:text-bg active:opacity-80',
  whatsapp: 'bg-wa text-wa-ink font-bold hover:bg-[#2BE06F] hover:shadow-[0_6px_14px_-6px_#25D366] active:bg-[#1FB858]',
  onImage: 'border border-paper/60 text-paper hover:bg-paper hover:text-coal',
  dark: 'bg-coal text-paper hover:opacity-90',
};
const SIZES: Record<Size, string> = {
  md: 'h-11 px-5 text-[14px] lg:h-[44px]',
  lg: 'h-[50px] px-6 text-[15px] lg:h-[52px]',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: Size = 'md', extra = '') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-btn font-semibold whitespace-nowrap select-none',
    'transition-[transform,filter,box-shadow,background-color,color] duration-200 active:scale-[0.97]',
    'disabled:pointer-events-none disabled:bg-line disabled:text-muted disabled:border-line disabled:shadow-none',
    VARIANTS[variant],
    SIZES[size],
    extra,
  ].join(' ');
}

type Common = { variant?: ButtonVariant; size?: Size; loading?: boolean; icon?: boolean; children: ReactNode };

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...rest }: Common & ComponentProps<'button'>) {
  return (
    // Loading keeps the variant colour (component sheet), so it blocks clicks without the disabled style.
    <button
      {...rest}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, `${loading ? 'pointer-events-none' : ''} ${className}`)}
    >
      <Inner loading={loading} icon={icon ?? variant === 'whatsapp'}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link {...rest} className={buttonClass(variant, size, className)}>
      <Inner icon={icon ?? variant === 'whatsapp'}>{children}</Inner>
    </Link>
  );
}

function Inner({ loading, icon, children }: { loading?: boolean; icon?: boolean; children: ReactNode }) {
  return (
    <>
      {loading ? <span className="spinner" aria-hidden /> : icon ? <ChatIcon width={18} height={18} /> : null}
      {children}
    </>
  );
}
