'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

const loadFeatures = () => import('./features').then((m) => m.default);

export const EASE = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/* reducedMotion="user": transforms are dropped, simple fades stay. */}
      <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
