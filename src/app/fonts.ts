import { Cormorant_Garamond, Fraunces, Manrope } from 'next/font/google';
import type { Skin } from '@/skins/schema';

// next/font self-hosts these at build time. Only the active skin's display face is preloaded.
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap', preload: false });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-cormorant', display: 'swap', preload: false });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

const DISPLAY = {
  Fraunces: { font: fraunces, weight: '380' },
  'Cormorant Garamond': { font: cormorant, weight: '600' },
} as const;

export function fontVars(skin: Skin) {
  const d = DISPLAY[skin.theme.fonts.display];
  return {
    className: `${d.font.variable} ${manrope.variable}`,
    style: {
      '--fd': `${d.font.style.fontFamily}, Georgia, serif`,
      '--fdw': d.weight,
      '--fb': `${manrope.style.fontFamily}, system-ui, sans-serif`,
    } as Record<string, string>,
  };
}
