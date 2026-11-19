import test from 'node:test';
import assert from 'node:assert/strict';
import { rsvpSchema } from '../src/lib/rsvp.ts';
const valid = { name: 'Khách mời', phone: '0901234567', side: 'groom', attendance: 'yes', guests: 2, wishes: 'Hạnh phúc nhé!', website: '' };
test('accept a valid RSVP', () => assert.equal(rsvpSchema.safeParse(valid).success, true));
test('reject malformed, oversized, automated and impossible submissions', () => {
  for (const patch of [{ phone: 'abc' }, { name: '' }, { guests: 11 }, { guests: 0 }, { guests: 1.5 }, { side: 'other' }, { wishes: 'a'.repeat(1501) }, { website: 'spam' }]) assert.equal(rsvpSchema.safeParse({ ...valid, ...patch }).success, false);
});
test('allow declined invitation with no guests', () => assert.equal(rsvpSchema.safeParse({ ...valid, attendance: 'no', guests: 0 }).success, true));
test('wishes are private by default and publication requires a boolean consent', () => {
  assert.equal(rsvpSchema.parse(valid).publish_wish, false);
  assert.equal(rsvpSchema.parse({ ...valid, publish_wish: true }).publish_wish, true);
  assert.equal(rsvpSchema.safeParse({ ...valid, publish_wish: 'true' }).success, false);
  assert.equal('wish_approved' in rsvpSchema.parse({ ...valid, wish_approved: true }), false);
});
test('only valid UUIDs are accepted for duplicate submission protection', () => {
  assert.equal(rsvpSchema.safeParse({ ...valid, submission_id: crypto.randomUUID() }).success, true);
  assert.equal(rsvpSchema.safeParse({ ...valid, submission_id: 'bad' }).success, false);
});
