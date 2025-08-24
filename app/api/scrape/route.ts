import { scrape, pickBestImage } from '@odeconto/scraper';
import { NextResponse } from 'next/server';

interface ScrapeError {
  error: {
    code: string;
    message: string;
  };
}

const ERROR_MAP: Record<string, { status: number; message: string }> = {
  ERR_INVALID_URL: { status: 400, message: 'Invalid URL' },
  ENOTFOUND: { status: 404, message: 'Host not found' },
  ENETUNREACH: { status: 503, message: 'Network unreachable' },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');
  if (!target) {
    return NextResponse.json(
      { error: { code: 'MISSING_URL', message: 'Missing url' } },
      { status: 400 }
    );
  }
  try {
    const result = await scrape(target);
    const title =
      result.meta.og.title ??
      result.meta.twitter.title ??
      result.meta.basic.title ??
      '';
    const image = pickBestImage(result.meta) || '';
    const favicon = result.meta.basic.favicon ?? '';
    const warnings = result.diagnostics.warnings ?? [];
    return NextResponse.json({ title, image, favicon, warnings });
  } catch (err: any) {
    const code: string | undefined =
      err?.error?.code ||
      err?.cause?.code ||
      err?.code ||
      (typeof err?.message === 'string' && err.message.startsWith('HTTP_')
        ? err.message
        : undefined);

    if (code) {
      if (code.startsWith('HTTP_')) {
        const status = Number(code.slice(5)) || 500;
        return NextResponse.json(
          { error: { code, message: `Upstream responded with ${status}` } },
          { status }
        );
      }
      const mapped = ERROR_MAP[code];
      if (mapped) {
        return NextResponse.json(
          { error: { code, message: mapped.message } },
          { status: mapped.status }
        );
      }
    }

    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { error: { code: 'TIMEOUT', message: 'Upstream request timed out' } },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: { code: 'UNKNOWN', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
