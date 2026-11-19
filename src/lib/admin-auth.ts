import 'server-only';
import { cookies } from 'next/headers';
import { allowedAdmin } from './admin-access';
import { storageReady, supabaseFetch } from './supabase';

export const adminCookie = process.env.NODE_ENV === 'production' ? '__Host-wedding-admin' : 'wedding-admin';
export async function getAdmin() {
  if (!storageReady() || !process.env.SUPABASE_ADMIN_EMAILS) return null;
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token) return null;
  try {
    const response = await supabaseFetch('/auth/v1/user', { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return null;
    const user = await response.json();
    return allowedAdmin(user, process.env.SUPABASE_ADMIN_EMAILS) ? { email: user.email as string } : null;
  } catch { return null; }
}
