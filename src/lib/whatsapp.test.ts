import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderMessage, buildReservationMessage, formatDate, isValidNgPhone, waLink } from './whatsapp.ts';

test('order message matches the build brief format', () => {
  const msg = buildOrderMessage({
    brand: 'Maison Lekki',
    groups: [
      { name: 'The Bakery', items: [{ name: 'Chin-chin croissant', qty: 2, price: 3500 }] },
      { name: 'The Restaurant', items: [{ name: 'Suya-spiced ribeye', qty: 1, price: 32000 }] },
    ],
    mode: 'delivery',
    address: '12 Admiralty Way, Lekki',
    name: 'Ada',
    phone: '0803 000 0000',
    note: 'No onions please',
  });
  assert.equal(
    msg,
    [
      'New order — Maison Lekki',
      '',
      'THE BAKERY',
      '2 × Chin-chin croissant — ₦7,000',
      '',
      'THE RESTAURANT',
      '1 × Suya-spiced ribeye — ₦32,000',
      '',
      'Subtotal: ₦39,000',
      'Pickup / Delivery: Delivery',
      'Address: 12 Admiralty Way, Lekki',
      'Name: Ada  ·  Phone: 0803 000 0000',
      'Note: No onions please',
      '(Delivery fee to be confirmed)',
    ].join('\n'),
  );
});

test('pickup order drops address and fee note', () => {
  const msg = buildOrderMessage({ brand: 'X', groups: [{ name: 'A', items: [{ name: 'B', qty: 1, price: 1000 }] }], mode: 'pickup', address: 'ignored', name: 'Ada', phone: '08030000000' });
  assert.ok(msg.includes('Pickup / Delivery: Pickup'));
  assert.ok(!msg.includes('Address'));
  assert.ok(!msg.includes('Delivery fee'));
});

test('reservation message matches the build brief format', () => {
  const msg = buildReservationMessage({ brand: 'Maison Lekki', date: '2026-10-24', time: '19:30', guests: 4, section: 'The Restaurant', name: 'Ada', phone: '0803 000 0000', note: 'Birthday, window seat if possible' });
  assert.equal(
    msg,
    [
      'Table request — Maison Lekki',
      'Date: Sat 24 Oct 2026  ·  Time: 7:30 PM',
      'Guests: 4  ·  Section: The Restaurant',
      'Name: Ada  ·  Phone: 0803 000 0000',
      'Note: Birthday, window seat if possible',
    ].join('\n'),
  );
});

test('Nigerian phone validation', () => {
  for (const ok of ['08031234567', '0803 123 4567', '+2348031234567', '234 803 123 4567']) assert.ok(isValidNgPhone(ok), ok);
  for (const bad of ['0803123456', '8031234567', '+44 7700 900000', '']) assert.ok(!isValidNgPhone(bad), bad);
});

test('wa.me link encodes text', () => {
  assert.equal(waLink('2347072655465', 'Hi & bye'), 'https://wa.me/2347072655465?text=Hi%20%26%20bye');
  assert.equal(formatDate('2026-10-31'), 'Sat 31 Oct 2026');
});
