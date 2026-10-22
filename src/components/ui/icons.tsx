// Restrained line icons, drawn on a 24px grid with currentColor.
import type { SVGProps } from 'react';

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

/** Chat bubble used for WhatsApp actions (not the WhatsApp logo). */
export const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ strokeWidth: 1.8, ...p })}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z" />
  </svg>
);

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...p })}>
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
);
