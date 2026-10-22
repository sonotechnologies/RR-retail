import { ImageResponse } from 'next/og';
import { getSkin } from '@/lib/skin';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon per skin: brand initial (store: monogram) on the accent colour. */
export default function Icon() {
  const skin = getSkin();
  const c = skin.theme.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: c.accent,
          color: c.accentInk,
          fontSize: skin.mode === 'store' ? 30 : 40,
          fontWeight: 700,
          fontFamily: 'serif',
          borderRadius: skin.theme.radius.card === '0px' ? 0 : 12,
        }}
      >
        {skin.mode === 'store' ? (skin.brand.monogram ?? skin.brand.name[0]) : skin.brand.name[0]}
      </div>
    ),
    size,
  );
}
