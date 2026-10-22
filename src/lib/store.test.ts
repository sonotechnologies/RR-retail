import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseColour } from './colours.ts';
import { badgeFor, filterProducts, isRecent, linePieces, lineTotal, NO_FILTERS, variantLabel, type StoreProduct } from './store.ts';
import { buildCustomMixMessage, buildProductQuestion, buildStoreOrderMessage } from './whatsapp.ts';

const SITE = 'https://rr.example';

test('retail line: qty = pieces, total = qty × retail price', () => {
  const l = { mode: 'retail' as const, qty: 2, min: 1, unitPrice: 4000 };
  assert.equal(linePieces(l), 2);
  assert.equal(lineTotal(l), 8000);
});

test('wholesale line: qty = bundles, pieces = bundles × min, total = pieces × wholesale price', () => {
  const l = { mode: 'wholesale' as const, qty: 2, min: 25, unitPrice: 7500 };
  assert.equal(linePieces(l), 50);
  assert.equal(lineTotal(l), 375000);
});

test('variant labels for mixed bundles', () => {
  assert.equal(variantLabel('M', 'Black'), 'M, Black');
  assert.equal(variantLabel('Mixed', 'Mixed'), 'Mixed sizes/colours');
  assert.equal(variantLabel('Mixed', 'Black'), 'Mixed sizes, Black');
  assert.equal(variantLabel('M', 'Mixed'), 'M, mixed colours');
});

test('badges: sold out wins, then tags, then recent restock', () => {
  assert.equal(badgeFor({ inStock: false, tags: ['New'] }, true), 'Sold out');
  assert.equal(badgeFor({ inStock: true, tags: ['new', 'few left'] }, false), 'Few left');
  assert.equal(badgeFor({ inStock: true, tags: [] }, true), 'Restocked');
  assert.equal(badgeFor({ inStock: true, tags: [] }, false), null);
});

test('just restocked = within the last 7 days', () => {
  assert.ok(isRecent('2026-10-20', '2026-10-22'));
  assert.ok(isRecent('2026-10-16', '2026-10-22'));
  assert.ok(!isRecent('2026-10-15', '2026-10-22'));
  assert.ok(!isRecent('2026-10-23', '2026-10-22'));
  assert.ok(!isRecent(null, '2026-10-22'));
});

test('colours: named swatches and inline hex', () => {
  assert.deepEqual(parseColour('Black'), { name: 'Black', hex: '#111111' });
  assert.deepEqual(parseColour('Faded red #9C4A42'), { name: 'Faded red', hex: '#9C4A42' });
  assert.equal(parseColour('Dusty teal').hex, null);
});

const prod = (p: Partial<StoreProduct>): StoreProduct => ({
  slug: 'x', name: 'X', category: 'basics', retailPrice: 1000, wholesalePrice: null, wholesaleMin: 20, sizes: [], colours: [], images: [],
  tags: [], inStock: true, soldOutSizes: [], featured: false, restockedAt: null, description: null, badge: null, recent: false, index: 0, ...p,
});

test('filters: search, size (not sold out), price band, in stock; sorts', () => {
  const list = [
    prod({ slug: 'a', name: 'Baggy Jeans', retailPrice: 9500, sizes: ['30', '32'], soldOutSizes: ['32'], restockedAt: '2026-10-20', index: 0 }),
    prod({ slug: 'b', name: 'Round Neck Tee', retailPrice: 3500, sizes: ['M'], restockedAt: '2026-10-21', index: 1 }),
    prod({ slug: 'c', name: 'Crop Top', retailPrice: 3000, inStock: false, index: 2 }),
  ];
  const slugs = (f: Partial<typeof NO_FILTERS>) => filterProducts(list, { ...NO_FILTERS, ...f }).map((p) => p.slug);
  assert.deepEqual(slugs({}), ['b', 'a', 'c']);
  assert.deepEqual(slugs({ sort: 'price' }), ['c', 'b', 'a']);
  assert.deepEqual(slugs({ q: 'jeans' }), ['a']);
  assert.deepEqual(slugs({ size: '32' }), []);
  assert.deepEqual(slugs({ size: '30' }), ['a']);
  assert.deepEqual(slugs({ band: 'under-5k' }), ['b', 'c']);
  assert.deepEqual(slugs({ inStock: true }), ['b', 'a']);
});

test('retail order message matches the build brief', () => {
  const msg = buildStoreOrderMessage({
    brand: 'RR Retail',
    siteUrl: SITE,
    lines: [
      { slug: 'ladies-basic-top-ls', name: 'Ladies Basic Top (Long Sleeve)', mode: 'retail', size: 'M', colour: 'Black', qty: 2, unitPrice: 4000, min: 1 },
      { slug: 'baggy-jeans', name: 'Baggy Jeans', mode: 'retail', size: '32', colour: 'Blue', qty: 1, unitPrice: 9500, min: 1 },
    ],
    fulfilment: 'pickup',
    pickupHours: '12pm–4pm',
    name: 'Tolu',
    phone: '0803 000 0000',
  });
  assert.equal(
    msg,
    [
      'New order — RR Retail (Retail)',
      '',
      '2 × Ladies Basic Top (Long Sleeve) — M, Black — ₦8,000',
      `${SITE}/p/ladies-basic-top-ls`,
      '1 × Baggy Jeans — 32, Blue — ₦9,500',
      `${SITE}/p/baggy-jeans`,
      '',
      'Subtotal: ₦17,500',
      'Option: Pickup (12pm–4pm)',
      'Name: Tolu · Phone: 0803 000 0000',
      'Note: —',
    ].join('\n'),
  );
});

test('wholesale order message matches the build brief', () => {
  const msg = buildStoreOrderMessage({
    brand: 'RR Retail',
    siteUrl: SITE,
    lines: [
      { slug: 'ladies-basic-top-ls', name: 'Ladies Basic Top', mode: 'wholesale', size: 'Mixed', colour: 'Mixed', qty: 1, unitPrice: 3000, min: 20 },
      { slug: 'baggy-jeans', name: 'Baggy Jeans', mode: 'wholesale', size: 'Mixed', colour: 'Mixed', qty: 2, unitPrice: 7500, min: 25 },
    ],
    fulfilment: 'waybill',
    address: 'Abuja',
    name: 'Chidi',
    phone: '0803 000 0000',
  });
  assert.equal(
    msg,
    [
      'New WHOLESALE order — RR Retail',
      '',
      '1 bundle (20 pcs) × Ladies Basic Top — Mixed sizes/colours — ₦60,000',
      `${SITE}/p/ladies-basic-top-ls`,
      '2 bundles (50 pcs) × Baggy Jeans — Mixed sizes/colours — ₦375,000',
      `${SITE}/p/baggy-jeans`,
      '',
      'Total: 70 pieces · ₦435,000',
      'Option: Waybill to Abuja (fee to be confirmed)',
      'Name: Chidi · Phone: 0803 000 0000',
      'Note: —',
    ].join('\n'),
  );
});

test('mixed bag sends one message with two labelled sections; Lagos delivery adds the address', () => {
  const msg = buildStoreOrderMessage({
    brand: 'RR Retail',
    siteUrl: SITE,
    lines: [
      { slug: 'a', name: 'Tee', mode: 'retail', size: 'M', colour: 'White', qty: 1, unitPrice: 3500, min: 1 },
      { slug: 'b', name: 'Jeans', mode: 'wholesale', size: 'Mixed', colour: 'Blue', qty: 1, unitPrice: 7500, min: 25 },
    ],
    fulfilment: 'lagos',
    address: '12 Allen Avenue, Ikeja',
    name: 'Ada',
    phone: '08030000000',
    note: 'Call before coming',
  });
  assert.ok(msg.startsWith('New order — RR Retail (Retail + Wholesale)\n\nRETAIL\n1 × Tee — M, White — ₦3,500'));
  assert.ok(msg.includes('\n\nWHOLESALE\n1 bundle (25 pcs) × Jeans — Mixed sizes, Blue — ₦187,500'));
  assert.ok(msg.includes('Total: 26 pieces · ₦191,000'));
  assert.ok(msg.includes('Option: Lagos delivery (fee to be confirmed)\nName: Ada · Phone: 08030000000\nAddress: 12 Allen Avenue, Ikeja\nNote: Call before coming'));
});

test('product question matches the build brief', () => {
  const base = { shortName: 'RR', name: 'Ladies Basic Top (Long Sleeve)', url: `${SITE}/p/x`, inStock: true };
  assert.equal(buildProductQuestion({ ...base, mode: 'retail', size: 'XL' }), `Hi RR, is the Ladies Basic Top (Long Sleeve) available in XL? ${SITE}/p/x`);
  assert.equal(buildProductQuestion({ ...base, mode: 'retail' }), `Hi RR, is the Ladies Basic Top (Long Sleeve) available? ${SITE}/p/x`);
  assert.equal(
    buildProductQuestion({ ...base, mode: 'wholesale', wholesalePrice: 3000, wholesaleMin: 20 }),
    `Hi RR, is the Ladies Basic Top (Long Sleeve) available for wholesale (bundle of 20 pcs at ₦3,000/pc)? ${SITE}/p/x`,
  );
  assert.equal(buildProductQuestion({ ...base, inStock: false, mode: 'retail' }), `Hi RR, when will the Ladies Basic Top (Long Sleeve) be back in stock? ${SITE}/p/x`);
});

test('custom mix lists items, pieces and links', () => {
  const msg = buildCustomMixMessage({
    shortName: 'RR',
    siteUrl: SITE,
    items: [
      { slug: 'tee', name: 'Round Neck Tee', pieces: 30 },
      { slug: 'jeans', name: 'Baggy Jeans', pieces: 20 },
      { slug: 'skip', name: 'Empty row', pieces: 0 },
    ],
  });
  assert.equal(
    msg,
    [
      "Hi RR, I'd like a custom wholesale mix:",
      '',
      '1. Round Neck Tee — 30 pcs',
      `   ${SITE}/p/tee`,
      '2. Baggy Jeans — 20 pcs',
      `   ${SITE}/p/jeans`,
      '',
      'Total: 50 pieces',
      "Please confirm prices and what's in stock.",
    ].join('\n'),
  );
});
