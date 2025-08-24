import { scrape, pickBestImage } from '@odeconto/scraper';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');
  if (!target) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }
  try {
    const result = await scrape(target);
    const title = result.meta.og.title ?? result.meta.twitter.title ?? result.meta.basic.title ?? '';
    const image = pickBestImage(result.meta) || '';
    const favicon = result.meta.basic.favicon ?? '';
    const warnings = result.diagnostics.warnings ?? [];
    return NextResponse.json({ title, image, favicon, warnings });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to scrape' }, { status: 500 });
  }
}
