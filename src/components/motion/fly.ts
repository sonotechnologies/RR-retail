'use client';

import { isDesktop, isReduced } from './tier';

/** Desktop add-to-cart: a clone of the dish image flies to the cart icon and shrinks to 0.12. */
export function flyToCart(from: HTMLElement | null | undefined) {
  if (!from || !isDesktop() || isReduced()) return;
  const target = [...document.querySelectorAll<HTMLElement>('[data-cart-target]')].find((el) => el.offsetParent !== null);
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (!a.width || a.bottom < 0 || a.top > innerHeight) return;
  const clone = from.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${a.left}px`,
    top: `${a.top}px`,
    width: `${a.width}px`,
    height: `${a.height}px`,
    margin: '0',
    zIndex: '80',
    pointerEvents: 'none',
    overflow: 'hidden',
    borderRadius: 'var(--rc)',
  });
  clone.style.viewTransitionName = 'none';
  document.body.appendChild(clone);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = clone.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1, borderRadius: 'var(--rc)' },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.7, borderRadius: '50%' },
    ],
    { duration: 650, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'forwards' },
  );
  anim.onfinish = () => clone.remove();
}
