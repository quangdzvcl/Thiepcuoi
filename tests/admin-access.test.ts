import test from 'node:test';
import assert from 'node:assert/strict';
import { allowedAdmin } from '../src/lib/admin-access.ts';
import { csvCell } from '../src/lib/guest-list.ts';

test('only allow explicitly listed, verified admin email addresses', () => {
  const user = { email: 'Owner@Example.com', email_confirmed_at: '2026-11-19T00:00:00Z' };
  assert.equal(allowedAdmin(user, ' owner@example.com, bride@example.com '), true);
  assert.equal(allowedAdmin(user, ''), false);
  assert.equal(allowedAdmin(user, 'other@example.com'), false);
  assert.equal(allowedAdmin({ ...user, email_confirmed_at: null }, 'owner@example.com'), false);
  assert.equal(allowedAdmin({}, 'owner@example.com'), false);
});

test('CSV export escapes quotation marks and spreadsheet formulas', () => {
  assert.equal(csvCell('Võ Hồng'), '"Võ Hồng"');
  assert.equal(csvCell('Chúc "hạnh phúc"'), '"Chúc ""hạnh phúc"""');
  for (const value of ['=HYPERLINK("bad")', '+123', '-1', '@SUM(1)', '\t=1+1']) assert.ok(csvCell(value).startsWith('"\''));
});
