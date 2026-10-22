// Desktop motion tier. Dynamically imported only when (min-width:1024px) and (pointer:fine) and
// motion is allowed, so mobile never downloads GSAP or Lenis.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

type W = Window & { __lenis?: Lenis };

let lenis: Lenis | undefined;
let cursor: HTMLElement | undefined;
let ctx: gsap.Context | undefined;

export function start() {
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.9 });
  (window as W).__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // Custom cursor: a dot that grows to "View" over [data-cursor="view"].
  cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  cursor.textContent = 'View';
  cursor.style.opacity = '0';
  document.body.appendChild(cursor);
  document.documentElement.classList.add('has-cursor');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  const move = (e: PointerEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
    cursor!.style.opacity = '1';
    const over = (e.target as Element | null)?.closest?.('[data-cursor="view"]');
    cursor!.classList.toggle('is-view', !!over);
  };
  const leave = () => (cursor!.style.opacity = '0');
  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', leave);

  return () => {
    window.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', leave);
    gsap.ticker.remove(raf);
    ctx?.revert();
    lenis?.destroy();
    cursor?.remove();
    document.documentElement.classList.remove('has-cursor');
    delete (window as W).__lenis;
  };
}

/** Re-scan the page after every route change: hero parallax and the pinned concepts row. */
export function scan() {
  ctx?.revert();
  ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.to(el, {
        yPercent: Number(el.dataset.parallax) || 18,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    document.querySelectorAll<HTMLElement>('[data-pin-section]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('[data-pin-track]');
      if (!track) return;
      section.classList.add('is-pinned');
      const distance = () => Math.max(0, track.scrollWidth - (track.parentElement?.clientWidth ?? innerWidth));
      if (distance() < 40) {
        section.classList.remove('is-pinned');
        return;
      }
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    // Runs on ctx.revert(): drop the pinned layout so the static grid comes back.
    return () => document.querySelectorAll('.is-pinned').forEach((el) => el.classList.remove('is-pinned'));
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export const pause = (on: boolean) => (on ? lenis?.stop() : lenis?.start());
