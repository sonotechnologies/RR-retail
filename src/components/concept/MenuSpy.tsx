'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { isReduced } from '@/components/motion/tier';

type LenisLike = { scrollTo: (y: number, o?: { duration?: number }) => void };

/** Sticky category tabs that scroll-spy the menu below (sections marked [data-cat]) and jump on tap.
 *  The active underline slides (transform only); the target list cross-fades in. */
export function MenuSpy({ categories, children }: { categories: string[]; children: ReactNode }) {
  const bar = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const indicator = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const lock = useRef(0);

  const offset = () => (bar.current?.getBoundingClientRect().bottom ?? 120) + 8;

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < lock.current) return;
      const secs = list.current?.querySelectorAll<HTMLElement>('[data-cat]');
      if (!secs) return;
      const line = offset() + 24;
      let a = 0;
      secs.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) a = i;
      });
      setActive(a);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide the underline and keep the active tab in view in the horizontal bar.
  useLayoutEffect(() => {
    const t = tabs.current[active];
    const ind = indicator.current;
    const scroller = bar.current?.querySelector<HTMLElement>('[data-scroller]');
    if (!t || !ind) return;
    ind.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth})`;
    if (scroller) {
      const target = t.offsetLeft - scroller.clientWidth / 2 + t.offsetWidth / 2;
      scroller.scrollTo({ left: target, behavior: isReduced() ? 'auto' : 'smooth' });
    }
  }, [active]);

  const go = useCallback((i: number) => {
    const sec = list.current?.querySelectorAll<HTMLElement>('[data-cat]')[i];
    if (!sec) return;
    const y = sec.getBoundingClientRect().top + window.scrollY - offset() + 1;
    setActive(i);
    lock.current = Date.now() + 900;
    const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: isReduced() ? 'auto' : 'smooth' });
    sec.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
  }, []);

  return (
    <>
      <div ref={bar} className="sticky top-[60px] z-30 border-b border-line bg-bg lg:top-[76px]">
        <div data-scroller className="no-scrollbar relative mx-auto flex gap-6 overflow-x-auto px-5 lg:max-w-[1280px] lg:gap-10 lg:px-0" role="tablist" aria-label="Menu categories">
          {categories.map((c, i) => (
            <button
              key={c}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => go(i)}
              className={`label shrink-0 pt-4 pb-[13px] text-[13px] font-semibold transition-colors duration-300 lg:pt-[19px] lg:pb-4 ${i === active ? 'text-text' : 'text-muted hover:text-text'}`}
            >
              {c}
            </button>
          ))}
          <span
            ref={indicator}
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 w-px origin-left bg-accent transition-transform duration-500 ease-out-expo"
          />
        </div>
      </div>
      <div ref={list} id="menu" className="scroll-mt-32">
        {children}
      </div>
    </>
  );
}
