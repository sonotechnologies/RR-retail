const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

/** ₦8,500. A price of 0 means "not set yet" (placeholder menus) and renders as ₦ —. */
export function formatNaira(n: number): string {
  return n > 0 ? naira.format(n) : '₦ —';
}

/** Readable text colour for a tint background (concept heroes). */
export function inkOn(hex: string): string {
  const v = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin((v >> 16) & 255) + 0.7152 * lin((v >> 8) & 255) + 0.0722 * lin(v & 255);
  // Contrast against #1E1B17 vs #FFFBF5; pick the larger.
  const dark = (L + 0.05) / (0.0119 + 0.05);
  const light = (0.9632 + 0.05) / (L + 0.05);
  return dark >= light ? '#1E1B17' : '#FFFBF5';
}

/** Tiny tinted SVG used as next/image blur placeholder for remote photos. */
export function blurData(color = '#E4DBCD'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${typeof btoa === 'function' ? btoa(svg) : Buffer.from(svg).toString('base64')}`;
}
