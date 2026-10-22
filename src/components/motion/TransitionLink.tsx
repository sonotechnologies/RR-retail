'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ComponentProps, type MouseEvent } from 'react';
import { isReduced } from './tier';

// Shared-element morph between pages via the View Transitions API. Elements opt in with
// style={{ viewTransitionName }}; browsers without the API fall back to the page fade in template.tsx.

let resolvePending: (() => void) | null = null;

/** Mounted once in the layout; finishes the pending view transition when the new route has rendered. */
export function RouteSignal() {
  const pathname = usePathname();
  useEffect(() => {
    resolvePending?.();
    resolvePending = null;
  }, [pathname]);
  return null;
}

type Doc = Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };

export function TransitionLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const doc = document as Doc;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (!doc.startViewTransition || isReduced() || href === pathname) return;
    e.preventDefault();
    const root = document.documentElement;
    root.classList.add('vt');
    const t = doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          resolvePending = resolve;
          setTimeout(resolve, 1500); // never hang if the route is slow
          router.push(href);
        }),
    );
    t.finished.finally(() => root.classList.remove('vt'));
  };
  return <Link href={href} onClick={go} {...rest} />;
}
