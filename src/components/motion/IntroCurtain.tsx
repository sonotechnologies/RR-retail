'use client';

import { useEffect, useRef } from 'react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Desktop page-load intro: logo draws in, curtain wipes up (1.2s, once per session).
 *  Visibility is decided before paint by the inline script in layout.tsx (html[data-intro]). */
export function IntroCurtain({ brand }: { brand: string }) {
  const curtain = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.intro || !curtain.current || !logo.current) return;
    try {
      sessionStorage.setItem('intro', '1');
    } catch {}
    logo.current.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 500, easing: EASE, fill: 'both' });
    const wipe = curtain.current.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], {
      duration: 700,
      delay: 450,
      easing: EASE,
      fill: 'both',
    });
    wipe.onfinish = () => {
      // Keep the hero timeline offsets (they key off data-intro) until they have run.
      setTimeout(() => delete root.dataset.intro, 900);
    };
  }, []);
  return (
    <div ref={curtain} aria-hidden className="intro-curtain fixed inset-0 z-[90] items-center justify-center bg-accent text-ink">
      <div ref={logo} className="display text-[64px] leading-none tracking-[-0.02em]">
        {brand}
      </div>
    </div>
  );
}

/** Inline, render-blocking: decides whether the intro plays before first paint (no flash of hero). */
export const introScript = `try{var m=matchMedia;if(location.pathname==='/'&&m('(min-width:1024px) and (pointer:fine)').matches&&!m('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('intro'))document.documentElement.dataset.intro='1'}catch(e){}`;
