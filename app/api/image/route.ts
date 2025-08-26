import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|ico|bmp|svg)$/i;

function inferContentType(u: URL, header: string | null): string {
  if (header?.startsWith('image/')) return header;
  const p = u.pathname.toLowerCase();
  if (p.endsWith('.png'))  return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.webp')) return 'image/webp';
  if (p.endsWith('.gif'))  return 'image/gif';
  if (p.endsWith('.svg'))  return 'image/svg+xml';
  if (p.endsWith('.ico'))  return 'image/x-icon';
  if (p.endsWith('.bmp'))  return 'image/bmp';
  return header ?? 'application/octet-stream';
}

function isBlockedHost(host: string): boolean {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local') ||
    /^[0-9.]+$/.test(host) // broaden if you want RFC1918 checks
  );
}

async function fetchImageWithFallback(target: URL) {
  const commonHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  // 1st attempt: referer = origin of the target
  let res = await fetch(target, {
    redirect: 'follow',
    cache: 'no-store',
    headers: { ...commonHeaders, Referer: `${target.origin}/` },
  });

  // 2nd attempt for 9GAG/CDN quirks
  if (!res.ok && /(^|\.)9gag\.com$/i.test(target.hostname)) {
    res = await fetch(target, {
      redirect: 'follow',
      cache: 'no-store',
      headers: { ...commonHeaders, Referer: 'https://9gag.com/' },
    });
  }

  return res;
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
  if (isBlockedHost(target.hostname)) {
    return new NextResponse('Blocked host', { status: 400 });
  }

  const upstream = await fetchImageWithFallback(target);
  if (!upstream.ok) {
    return new NextResponse(`Upstream ${upstream.status}`, { status: upstream.status });
  }

  // Use final URL after redirects for extension inference
  const finalURL = new URL(upstream.url);
  const headerType = upstream.headers.get('content-type');
  const inferred = inferContentType(finalURL, headerType);

  if (!inferred.startsWith('image/') && !IMAGE_EXT_RE.test(finalURL.pathname)) {
    return new NextResponse('Not an image', { status: 415 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': inferred,
      'Cache-Control': 'public, max-age=86400, immutable',
      'X-Proxy-By': 'img-proxy-v2'
    },
  });
}
