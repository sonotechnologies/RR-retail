import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime, getStatus, weeklySummary, type Hours } from './hours.ts';

const bakery: Hours = {
  mon: null,
  tue: ['07:00', '18:00'],
  wed: ['07:00', '18:00'],
  thu: ['07:00', '18:00'],
  fri: ['07:00', '18:00'],
  sat: ['07:00', '18:00'],
  sun: ['07:00', '18:00'],
};
// Lagos is UTC+1: 2026-10-22 is a Thursday.
const at = (iso: string) => new Date(`${iso}+01:00`);

test('formatTime', () => {
  assert.equal(formatTime('19:30'), '7:30pm');
  assert.equal(formatTime('12:00'), '12pm');
  assert.equal(formatTime('00:00'), '12am');
  assert.equal(formatTime('19:30', true), '7:30 PM');
});

test('open, closing soon, closed', () => {
  assert.deepEqual(getStatus(bakery, at('2026-10-22T10:00')), { state: 'open', label: 'Open until 6pm' });
  assert.deepEqual(getStatus(bakery, at('2026-10-22T17:15')), { state: 'soon', label: 'Closing soon · 6pm' });
  assert.deepEqual(getStatus(bakery, at('2026-10-22T06:00')), { state: 'closed', label: 'Opens 7am' });
  assert.deepEqual(getStatus(bakery, at('2026-10-22T19:00')), { state: 'closed', label: 'Opens 7am tomorrow' });
  // Sunday evening: Monday closed, so next opening is Tuesday.
  assert.deepEqual(getStatus(bakery, at('2026-10-25T19:00')), { state: 'closed', label: 'Opens Tue 7am' });
});

test('past-midnight close', () => {
  const late: Hours = { mon: ['18:00', '02:00'], tue: null, wed: null, thu: null, fri: null, sat: null, sun: null };
  assert.equal(getStatus(late, at('2026-10-26T23:30')).label, 'Open until 2am');
  assert.equal(getStatus(late, at('2026-10-27T01:30')).state, 'soon');
});

test('weekly summary', () => {
  assert.equal(weeklySummary(bakery), '7am – 6pm · closed Mon');
  const restaurant: Hours = { ...bakery, mon: ['12:00', '23:00'], tue: ['12:00', '23:00'], wed: ['12:00', '23:00'], thu: ['12:00', '23:00'], fri: ['12:00', '23:00'], sat: ['12:00', '23:00'], sun: ['12:00', '22:00'] };
  assert.equal(weeklySummary(restaurant), '12pm – 11pm · Sun till 10pm');
});
