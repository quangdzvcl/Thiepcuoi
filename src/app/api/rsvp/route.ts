import { NextResponse } from 'next/server';
import { rsvpSchema } from '@/lib/rsvp';
import { supabaseFetch } from '@/lib/supabase';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ message: 'Yêu cầu JSON.' }, { status: 415 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 10000) return NextResponse.json({ message: 'Nội dung quá dài.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ message: 'Dữ liệu không hợp lệ.' }, { status: 400 }); }
  const result = rsvpSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ message: 'Vui lòng kiểm tra họ tên, số điện thoại và số khách (1–10).' }, { status: 400 });
  const provider = process.env.RSVP_PROVIDER || 'demo';
  if (provider === 'demo') return NextResponse.json({ demo: true, message: 'Đây là chế độ trải nghiệm. Thông tin chưa được lưu; vui lòng liên hệ trực tiếp cô dâu/chú rể.' });
  if (provider !== 'supabase' || !process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) return NextResponse.json({ message: 'Hệ thống chưa được cấu hình. Vui lòng liên hệ cô dâu/chú rể.' }, { status: 503 });
  const { website: _honeypot, ...data } = result.data;
  void _honeypot;
  try {
    const response = await supabaseFetch('/rest/v1/rsvps?on_conflict=submission_id', { method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ ...data, submission_id: data.submission_id ?? crypto.randomUUID(), guests: data.attendance === 'no' ? 0 : data.guests }) });
    if (!response.ok) throw new Error('Storage rejected request');
    return NextResponse.json({ demo: false, message: 'Chúng mình đã nhận được xác nhận và lời chúc của bạn. Cảm ơn bạn thật nhiều!' }, { status: 201 });
  } catch { return NextResponse.json({ message: 'Chưa gửi được xác nhận. Bạn vui lòng thử lại sau.' }, { status: 502 }); }
}
