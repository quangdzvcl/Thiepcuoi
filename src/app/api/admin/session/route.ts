import { NextResponse } from 'next/server';
import { adminCookie } from '@/lib/admin-auth';
import { allowedAdmin } from '@/lib/admin-access';
import { sameOrigin, storageReady, supabaseFetch } from '@/lib/supabase';

export const runtime = 'nodejs';
const privateHeaders = { 'Cache-Control': 'private, no-store' };
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ message: 'Nguồn gửi không hợp lệ.' }, { status: 403, headers: privateHeaders });
  if (!storageReady() || !process.env.SUPABASE_ADMIN_EMAILS) return NextResponse.json({ message: 'Chưa kết nối tài khoản quản lý. Vui lòng hoàn tất cấu hình Supabase.' }, { status: 503, headers: privateHeaders });
  try {
    const raw = await request.text();
    if (raw.length > 4000) return NextResponse.json({ message: 'Dữ liệu không hợp lệ.' }, { status: 400, headers: privateHeaders });
    const { email, password } = JSON.parse(raw);
    if (typeof email !== 'string' || typeof password !== 'string' || !password || !process.env.SUPABASE_ADMIN_EMAILS.split(',').some(value => value.trim().toLowerCase() === email.trim().toLowerCase())) {
      return NextResponse.json({ message: 'Email hoặc mật khẩu không đúng.' }, { status: 401, headers: privateHeaders });
    }
    const response = await supabaseFetch('/auth/v1/token?grant_type=password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), password }) });
    if (!response.ok) return NextResponse.json({ message: response.status === 429 ? 'Bạn thử lại sau ít phút nhé.' : 'Email hoặc mật khẩu không đúng.' }, { status: response.status === 429 ? 429 : 401, headers: privateHeaders });
    const session = await response.json();
    if (!session.access_token || !allowedAdmin(session.user ?? {}, process.env.SUPABASE_ADMIN_EMAILS)) return NextResponse.json({ message: 'Tài khoản chưa có quyền quản lý.' }, { status: 403, headers: privateHeaders });
    const result = NextResponse.json({ ok: true }, { headers: privateHeaders });
    result.cookies.set(adminCookie, session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: Math.min(Number(session.expires_in) || 3600, 3600) });
    return result;
  } catch { return NextResponse.json({ message: 'Chưa đăng nhập được. Vui lòng thử lại.' }, { status: 502, headers: privateHeaders }); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403, headers: privateHeaders });
  const result = NextResponse.json({ ok: true }, { headers: privateHeaders });
  result.cookies.set(adminCookie, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return result;
}
