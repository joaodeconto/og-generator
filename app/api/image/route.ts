import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|ico|bmp|svg)$/i;

function inferContentType(u: URL, header: string | null): string {
  if (header?.startsWith('image/')) return header;

  const p = u.pathname.toLowerCase();
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.webp')) return 'image/webp';
  if (p.endsWith('.gif')) return 'image/gif';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.ico')) return 'image/x-icon';
  if (p.endsWith('.bmp')) return 'image/bmp';

  // fallback if server lies/omits header and extension is unknown
  return header ?? 'application/octet-stream';
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const raw = url.searchParams.get('url');
  if (!raw) return new NextResponse('Missing url', { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.has(target.protocol)) {
    return new NextResponse('Blocked protocol', { status: 400 });
  }

  // Basic SSRF guard (tune to your needs)
  const host = target.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local') ||
    /^[0-9.]+$/.test(host) // raw IPv4; extend for RFC1918 if you like
  ) {
    return new NextResponse('Blocked host', { status: 400 });
  }

  const upstream = await fetch(target, {
    redirect: 'follow',
    cache: 'no-store',
    headers: {
      // Some CDNs change behavior based on UA/Accept
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      // A few hosts expect a Referer; safest is same-origin to the target
      'Referer': `${target.origin}/`,
    },
  });

  if (!upstream.ok) {
    return new NextResponse(`Upstream error ${upstream.status}`, { status: 404 });
  }

  const headerType = upstream.headers.get('content-type');
  const inferred = inferContentType(target, headerType);

  // If neither the header nor extension look like an image, bail
  if (!inferred.startsWith('image/') && !IMAGE_EXT_RE.test(target.pathname)) {
    return new NextResponse('Not an image', { status: 415 });
  }

  // Stream through (prefer streaming over buffering)
  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': inferred,
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
