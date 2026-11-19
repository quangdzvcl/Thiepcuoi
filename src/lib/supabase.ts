import 'server-only';

export function storageReady() {
  return process.env.RSVP_PROVIDER === 'supabase' && !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SECRET_KEY;
}

export async function supabaseFetch(path: string, init: RequestInit = {}) {
  if (!storageReady()) throw new Error('Storage not configured');
  const headers = new Headers(init.headers);
  const key = process.env.SUPABASE_SECRET_KEY!;
  headers.set('apikey', key);
  // Legacy service_role JWTs also require Authorization. New secret keys use apikey.
  if (key.startsWith('eyJ') && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${key}`);
  return fetch(`${process.env.SUPABASE_URL!.replace(/\/$/, '')}${path}`, {
    ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
}

export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
