import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = url.searchParams.get('url');
  if (!target) return new NextResponse('Missing url', { status: 400 });

  // Fetch the remote image on the server
  const res = await fetch(target, { cache: 'no-store' });
  if (!res.ok) return new NextResponse('Failed to fetch image', { status: 502 });

  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const arrayBuffer = await res.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': contentType,
      // cache a bit if you like:
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
