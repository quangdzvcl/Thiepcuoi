import { NextResponse } from 'next/server';
import { storageReady, supabaseFetch } from '@/lib/supabase';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!storageReady()) return NextResponse.json({ wishes: [], configured: false }, { headers });
  const offset = Math.max(0, Math.min(10000, Number(new URL(request.url).searchParams.get('offset')) || 0));
  const limit = Math.floor(Math.max(1, Math.min(200, Number(new URL(request.url).searchParams.get('limit')) || 20)));
  try {
    // Explicit projection: phone, attendance, side and guest counts never leave this endpoint.
    const response = await supabaseFetch(`/rest/v1/rsvps?select=id,name,wishes,created_at&publish_wish=eq.true&wish_approved=eq.true&wishes=neq.&order=created_at.desc,id.desc&limit=${limit + 1}&offset=${Math.floor(offset)}`);
    if (!response.ok) throw new Error('Read failed');
    const wishes = await response.json();
    return NextResponse.json({ wishes: wishes.slice(0, limit), hasMore: wishes.length > limit, configured: true }, { headers });
  } catch { return NextResponse.json({ message: 'Chưa tải được lời chúc.' }, { status: 503, headers }); }
}
