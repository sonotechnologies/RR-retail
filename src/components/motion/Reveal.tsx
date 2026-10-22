'use client';

import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { EASE } from './MotionProvider';
import { useMotionTier } from './tier';

type Props = {
  children: ReactNode;
  className?: string;
  /** Position in a staggered group. */
  index?: number;
  /** "image": inset clip-path wipe on desktop, fade on mobile. */
  variant?: 'text' | 'image';
  as?: 'div' | 'li' | 'section';
};

/** Section reveal: text fades up 24px (desktop) / 16px (mobile), staggered; images wipe in on desktop. */
export function Reveal({ children, className, index = 0, variant = 'text', as = 'div' }: Props) {
  const { desktop, reduced } = useMotionTier();
  const Tag = m[as];
  const delay = index * (desktop ? 0.08 : 0.06);
  const duration = desktop ? 0.9 : 0.5;
  if (variant === 'image' && desktop && !reduced) {
    return (
      <Tag
        className={className}
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </Tag>
    );
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: desktop ? 24 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
