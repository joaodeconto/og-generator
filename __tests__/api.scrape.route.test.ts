import { scrape, pickBestImage } from '@odeconto/scraper';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init: any) => ({
      json: async () => body,
      status: init?.status,
    }),
  },
}));

jest.mock('@odeconto/scraper', () => ({
  scrape: jest.fn(),
  pickBestImage: jest.fn(),
}));

const scrapeMock = scrape as jest.Mock;
const pickBestImageMock = pickBestImage as jest.Mock;

describe('GET /api/scrape', () => {
  beforeEach(() => {
    scrapeMock.mockReset();
    pickBestImageMock.mockReset();
  });

  it('returns scraped metadata', async () => {
    scrapeMock.mockResolvedValueOnce({
      meta: {
        og: { title: 'Example Title' },
        twitter: {},
        basic: { favicon: 'https://example.com/favicon.ico' },
        fallback: {},
      },
      diagnostics: {
        warnings: ['warn'],
        source: {},
        timingsMs: { fetch: 0, parse: 0 },
      },
    });
    pickBestImageMock.mockReturnValueOnce('https://example.com/image.png');

    const { GET } = await import('../app/api/scrape/route');
    const req = {
      url: 'http://localhost/api/scrape?url=https://example.com',
    } as Request;
    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual({
      title: 'Example Title',
      image: 'https://example.com/image.png',
      favicon: 'https://example.com/favicon.ico',
      warnings: ['warn'],
    });
    expect(scrape).toHaveBeenCalledWith('https://example.com');
    expect(pickBestImage).toHaveBeenCalled();
  });

  it('maps known error codes', async () => {
    scrapeMock.mockRejectedValueOnce({
      error: { code: 'ERR_INVALID_URL', message: 'Invalid URL' },
    });

    const { GET } = await import('../app/api/scrape/route');
    const req = { url: 'http://localhost/api/scrape?url=bad' } as Request;
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data).toEqual({
      error: { code: 'ERR_INVALID_URL', message: 'Invalid URL' },
    });
  });

  it('handles unexpected errors', async () => {
    scrapeMock.mockRejectedValueOnce(new Error('boom'));

    const { GET } = await import('../app/api/scrape/route');
    const req = {
      url: 'http://localhost/api/scrape?url=https://example.com',
    } as Request;
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data).toEqual({
      error: { code: 'UNKNOWN', message: 'Internal server error' },
    });
  });
});
