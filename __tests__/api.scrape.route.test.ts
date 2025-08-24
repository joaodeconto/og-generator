import { scrape, pickBestImage } from '@odeconto/scraper';

jest.mock('next/server', () => ({
  NextResponse: { json: (body: any) => ({ json: async () => body }) }
}));

jest.mock('@odeconto/scraper', () => ({
  scrape: jest.fn(async () => ({
    meta: {
      og: { title: 'Example Title' },
      twitter: {},
      basic: { favicon: 'https://example.com/favicon.ico' },
      fallback: {}
    },
    diagnostics: { warnings: ['warn'], source: {}, timingsMs: { fetch: 0, parse: 0 } }
  })),
  pickBestImage: jest.fn(() => 'https://example.com/image.png')
}));

describe('GET /api/scrape', () => {
  it('returns scraped metadata', async () => {
    const { GET } = await import('../app/api/scrape/route');
    const req = { url: 'http://localhost/api/scrape?url=https://example.com' } as Request;
    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({
      title: 'Example Title',
      image: 'https://example.com/image.png',
      favicon: 'https://example.com/favicon.ico',
      warnings: ['warn']
    });
    expect(scrape).toHaveBeenCalledWith('https://example.com');
    expect(pickBestImage).toHaveBeenCalled();
  });
});
