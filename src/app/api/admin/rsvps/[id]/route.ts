import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/admin-auth';
import { sameOrigin, supabaseFetch } from '@/lib/supabase';
export const runtime = 'nodejs';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403, headers });
  if (!await getAdmin()) return NextResponse.json({ message: 'Vui lòng đăng nhập lại.' }, { status: 401, headers });
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) return new NextResponse(null, { status: 400, headers });
  try {
    const raw = await request.text();
    if (raw.length > 100) return new NextResponse(null, { status: 400, headers });
    const { approved } = JSON.parse(raw);
    if (typeof approved !== 'boolean') return new NextResponse(null, { status: 400, headers });
    const response = await supabaseFetch(`/rest/v1/rsvps?id=eq.${id}&publish_wish=eq.true&wishes=neq.`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ wish_approved: approved }) });
    if (!response.ok) throw new Error('Update failed');
    const rows = await response.json();
    if (!rows.length) return NextResponse.json({ message: 'Khách chưa đồng ý công khai lời chúc.' }, { status: 409, headers });
    return NextResponse.json({ ok: true }, { headers });
  } catch { return NextResponse.json({ message: 'Chưa cập nhật được lời chúc.' }, { status: 502, headers }); }
}
