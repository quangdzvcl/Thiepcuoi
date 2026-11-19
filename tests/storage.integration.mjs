// Run after `npm run build`. Only uses an ephemeral local Supabase HTTP stub.
// Never connects to a real project or writes real guest records.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const rows = []; const adminToken = 'local-test-session-not-a-real-token';
const json = (res, status, value, headers = {}) => { res.writeHead(status, { 'content-type': 'application/json', ...headers }); res.end(JSON.stringify(value)); };
const mock = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'); let raw = '';
  for await (const chunk of req) raw += chunk;
  if (req.headers.apikey !== 'sb_secret_local_test') return json(res, 401, {});
  if (url.pathname === '/auth/v1/token') return json(res, 200, { access_token: adminToken, expires_in: 3600, user: { email: 'owner@example.com', email_confirmed_at: '2026-11-19T00:00:00Z' } });
  if (url.pathname === '/auth/v1/user') return req.headers.authorization === `Bearer ${adminToken}` ? json(res, 200, { email: 'owner@example.com', email_confirmed_at: '2026-11-19T00:00:00Z' }) : json(res, 401, {});
  if (url.pathname === '/rest/v1/rpc/wedding_rsvp_stats') return json(res, 200, { responses: rows.length, accepted: rows.filter(r => r.attendance === 'yes').length, declined: 0, maybe: 0, attendees: rows.reduce((n, r) => n + r.guests, 0), groom_attendees: 2, bride_attendees: 0, pending_wishes: rows.filter(r => r.publish_wish && !r.wish_approved).length });
  if (url.pathname === '/rest/v1/rsvps') {
    if (req.method === 'POST') { const data = JSON.parse(raw); if (!rows.some(row => row.submission_id === data.submission_id)) rows.push({ ...data, id: crypto.randomUUID(), created_at: new Date().toISOString(), wish_approved: false }); return json(res, 201, {}); }
    let selected = rows.filter(row => [...url.searchParams].every(([key, value]) => {
      if (!['id', 'attendance', 'side', 'publish_wish', 'wish_approved'].includes(key)) return true;
      return value === `eq.${String(row[key])}`;
    }));
    if (req.method === 'PATCH') { const patch = JSON.parse(raw); selected.forEach(row => Object.assign(row, patch)); return json(res, 200, selected); }
    const columns = url.searchParams.get('select').split(','); const total = selected.length;
    selected = selected.slice(Number(url.searchParams.get('offset') || 0), Number(url.searchParams.get('offset') || 0) + Number(url.searchParams.get('limit') || 50));
    return json(res, 200, selected.map(row => Object.fromEntries(columns.map(key => [key, row[key]]))), { 'Content-Range': `0-${Math.max(0, selected.length-1)}/${total}` });
  }
  return json(res, 404, {});
});
mock.listen(0, '127.0.0.1'); await once(mock, 'listening');
const reserve = createServer(); reserve.listen(0, '127.0.0.1'); await once(reserve, 'listening'); const port = reserve.address().port; await new Promise(resolve => reserve.close(resolve));
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], { windowsHide: true, stdio: 'ignore', env: { ...process.env, RSVP_PROVIDER: 'supabase', SUPABASE_URL: `http://127.0.0.1:${mock.address().port}`, SUPABASE_SECRET_KEY: 'sb_secret_local_test', SUPABASE_ADMIN_EMAILS: 'owner@example.com' } });
const base = `http://localhost:${port}`; const request = (path, init = {}) => fetch(base + path, { ...init, headers: { Origin: base, 'Content-Type': 'application/json', ...init.headers } });
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) { try { if ((await fetch(base)).ok) { ready = true; break; } } catch {} await new Promise(resolve => setTimeout(resolve, 100)); }
  assert.ok(ready, 'Next.js server started');
  assert.equal((await request('/api/admin/rsvps')).status, 401, 'guest list rejects anonymous reads');
  assert.equal((await request('/api/admin/rsvps', { headers: { Cookie: '__Host-wedding-admin=forged' } })).status, 401, 'forged session rejected');
  assert.equal((await request('/api/admin/session', { method: 'POST', headers: { Origin: 'https://other.example' }, body: '{}' })).status, 403, 'login CSRF rejected');
  assert.equal((await request('/api/admin/session', { method: 'POST', body: JSON.stringify({ email: 'not-owner@example.com', password: 'local-test' }) })).status, 401, 'unlisted account rejected');
  const login = await request('/api/admin/session', { method: 'POST', body: JSON.stringify({ email: 'owner@example.com', password: 'local-test' }) });
  assert.equal(login.status, 200); const cookie = login.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/i); assert.match(cookie, /Secure/i); assert.match(cookie, /SameSite=strict/i);
  assert.deepEqual(await login.json(), { ok: true }, 'access token is not returned in JSON');
  const auth = { Cookie: cookie.split(';')[0] };
  const guest = { name: 'Khách kiểm tra cục bộ', phone: '0900000000', side: 'groom', attendance: 'yes', guests: 2, wishes: 'Chúc hạnh phúc!', website: '', publish_wish: true, submission_id: crypto.randomUUID() };
  assert.equal((await request('/api/rsvp', { method: 'POST', headers: { Origin: 'https://other.example' }, body: JSON.stringify(guest) })).status, 403);
  for (let attempt = 0; attempt < 2; attempt++) assert.equal((await request('/api/rsvp', { method: 'POST', body: JSON.stringify(guest) })).status, 201);
  assert.equal(rows.length, 1, 'retry keeps the same submission ID');
  assert.deepEqual((await (await request('/api/wishes')).json()).wishes, [], 'pending wishes stay private');
  assert.equal((await request(`/api/admin/rsvps/${rows[0].id}`, { method: 'PATCH', body: '{"approved":true}' })).status, 401);
  assert.equal((await request(`/api/admin/rsvps/${rows[0].id}`, { method: 'PATCH', headers: auth, body: '{"approved":true}' })).status, 200);
  const published = await (await request('/api/wishes')).json();
  assert.equal(published.wishes.length, 1); assert.deepEqual(Object.keys(published.wishes[0]).sort(), ['created_at', 'id', 'name', 'wishes']);
  const privateGuest = { ...guest, submission_id: crypto.randomUUID(), publish_wish: false };
  await request('/api/rsvp', { method: 'POST', body: JSON.stringify(privateGuest) });
  assert.equal((await request(`/api/admin/rsvps/${rows[1].id}`, { method: 'PATCH', headers: auth, body: '{"approved":true}' })).status, 409, 'cannot publish without guest consent');
  const guests = await (await request('/api/admin/rsvps?attendance=yes', { headers: auth })).json();
  assert.equal(guests.total, 2); assert.equal(guests.stats.attendees, 4); assert.equal(guests.guests[0].phone, guest.phone);
  assert.equal((await request('/api/admin/session', { method: 'DELETE', headers: auth })).status, 200);
  console.log('PASS: private guest list, session checks, CSRF, idempotency, consent, moderation, public field projection, counts, logout. No real guest data written.');
} finally {
  app.kill(); mock.closeAllConnections(); await new Promise(resolve => mock.close(resolve));
}
