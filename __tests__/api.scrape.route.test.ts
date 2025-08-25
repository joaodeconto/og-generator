import { scrape, pickBestImage } from '@odeconto/scraper';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status ?? 200,
    }),
  },
}));

jest.mock('@odeconto/scraper', () => ({
  scrape: jest.fn(async () => ({
    meta: {
      og: { title: 'Example Title', description: 'Example description' },
      twitter: {},
      basic: { favicon: 'https://example.com/favicon.ico' },
      fallback: {}
    },
    diagnostics: { warnings: ['warn'], source: {}, timingsMs: { fetch: 0, parse: 0 } }
  })),
  pickBestImage: jest.fn(() => 'https://example.com/image.png')
}));

describe('GET /api/scrape', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns scraped metadata', async () => {
    const { GET } = await import('../app/api/scrape/route');
    const req = { url: 'http://localhost/api/scrape?url=https://example.com' } as Request;
    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({
      title: 'Example Title',
      description: 'Example description',
      image: 'https://example.com/image.png',
      favicon: 'https://example.com/favicon.ico',
      warnings: ['warn']
    });
    expect(scrape).toHaveBeenCalledWith('https://example.com');
    expect(pickBestImage).toHaveBeenCalled();
  });

  it('returns 400 when url is missing', async () => {
    const { GET } = await import('../app/api/scrape/route');
    const req = { url: 'http://localhost/api/scrape' } as Request;
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: 'Missing url' });
  });

  it('returns 500 when scrape fails', async () => {
    (scrape as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { GET } = await import('../app/api/scrape/route');
    const req = { url: 'http://localhost/api/scrape?url=https://example.com' } as Request;
    const res = await GET(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data).toEqual({ error: 'fail' });
  });

  it('resolves relative image and favicon URLs', async () => {
    (scrape as jest.Mock).mockResolvedValueOnce({
      meta: {
        og: {},
        twitter: {},
        basic: { favicon: '/favicon.ico' },
        fallback: {}
      },
      diagnostics: { warnings: [], source: {}, timingsMs: { fetch: 0, parse: 0 } }
    });
    (pickBestImage as jest.Mock).mockReturnValueOnce('/image.png');

    const { GET } = await import('../app/api/scrape/route');
    const req = { url: 'http://localhost/api/scrape?url=https://example.com/base' } as Request;
    const res = await GET(req);
    const data = await res.json();
    expect(data.image).toBe('https://example.com/image.png');
    expect(data.favicon).toBe('https://example.com/favicon.ico');
  });
});
