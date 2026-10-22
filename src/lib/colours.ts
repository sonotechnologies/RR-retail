// Swatch colours for product colour names. A sheet cell can also carry its own hex: "Faded red #9C4A42".

const NAMED: Record<string, string> = {
  black: '#111111',
  white: '#EEE9E2',
  cream: '#E8DCC6',
  beige: '#D8C3A5',
  nude: '#D9B99B',
  brown: '#6B4A36',
  khaki: '#A08C64',
  grey: '#8A8580',
  gray: '#8A8580',
  ash: '#9B9690',
  navy: '#1F2A44',
  blue: '#3D5A80',
  'light wash': '#9DB3C8',
  'dark wash': '#2E3E55',
  denim: '#4A6283',
  green: '#3F6B4A',
  olive: '#6B6B3A',
  red: '#B23A32',
  wine: '#6E1F2B',
  maroon: '#6E1F2B',
  pink: '#D9A3A8',
  purple: '#6A4C8C',
  lilac: '#B9A3D0',
  yellow: '#E2C044',
  orange: '#D9782D',
};

export type Colour = { name: string; hex: string | null };

export function parseColour(raw: string): Colour {
  const m = raw.trim().match(/^(.*?)\s*(#[0-9a-fA-F]{6})$/);
  if (m) return { name: m[1].trim() || m[2], hex: m[2] };
  const name = raw.trim();
  const key = name.toLowerCase();
  return { name, hex: NAMED[key] ?? NAMED[key.split(/\s+/).pop() ?? ''] ?? null };
}
