import type { Metadata } from 'next';
import { getAdmin } from '@/lib/admin-auth';
import GuestDashboard from '@/components/guest-dashboard';
import { storageReady } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Quản lý khách mời — Xuân Quang & Võ Hồng', robots: { index: false, follow: false } };
export default async function AdminPage() {
  const admin = await getAdmin();
  return <GuestDashboard email={admin?.email ?? null} configured={storageReady() && !!process.env.SUPABASE_ADMIN_EMAILS} />;
}
