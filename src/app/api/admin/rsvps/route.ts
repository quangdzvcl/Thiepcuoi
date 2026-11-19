import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/admin-auth';
import { supabaseFetch } from '@/lib/supabase';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!await getAdmin()) return NextResponse.json({ message: 'Vui lòng đăng nhập lại.' }, { status: 401, headers });
  const input = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(10000, Number(input.get('page')) || 1));
  const params = new URLSearchParams({ select: 'id,created_at,name,phone,side,attendance,guests,wishes,publish_wish,wish_approved', order: 'created_at.desc,id.desc', limit: '50', offset: String((Math.floor(page) - 1) * 50) });
  const attendance = input.get('attendance'); const side = input.get('side');
  if (attendance && ['yes', 'no', 'maybe'].includes(attendance)) params.set('attendance', `eq.${attendance}`);
  if (side && ['groom', 'bride'].includes(side)) params.set('side', `eq.${side}`);
  const search = (input.get('search') || '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 100);
  if (search) params.set('name', `ilike.*${search}*`);
  try {
    const [response, stats] = await Promise.all([
      supabaseFetch(`/rest/v1/rsvps?${params}`, { headers: { Prefer: 'count=exact' } }),
      supabaseFetch('/rest/v1/rpc/wedding_rsvp_stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }),
    ]);
    if (!response.ok || !stats.ok) throw new Error('Read failed');
    return NextResponse.json({ guests: await response.json(), total: Number(response.headers.get('Content-Range')?.split('/')[1] || 0), stats: await stats.json() }, { headers });
  } catch { return NextResponse.json({ message: 'Chưa đọc được danh sách khách. Kiểm tra kết nối và bảng Supabase.' }, { status: 503, headers }); }
}
