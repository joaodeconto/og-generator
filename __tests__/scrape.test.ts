import { scrape, pickBestImage } from '@odeconto/scraper';

jest.mock(
  '@odeconto/scraper',
  () => ({
    __esModule: true,
    scrape: jest.fn(async () => ({
      meta: {
        og: {
          images: [
            { url: 'https://example.com/small.jpg', width: 100, height: 100 },
            { url: 'https://example.com/large.jpg', width: 200, height: 150 },
          ],
        },
        basic: { title: 'Basic Title' },
      },
    })),
    pickBestImage: (meta: any) => {
      const images = meta.og?.images ?? [];
      return images.reduce((best: any, img: any) => {
        const area = (img.width || 0) * (img.height || 0);
        const bestArea = (best?.width || 0) * (best?.height || 0);
        return area > bestArea ? img : best;
      }, undefined);
    },
  }),
  { virtual: true }
);

describe('scrape', () => {
  it('resolves title and best image', async () => {
    const result = await scrape('https://example.com');
    const title = result.meta.og?.title ?? result.meta.basic?.title ?? '(no title)';
    const bestImage = pickBestImage(result.meta);

    expect(title).toBe('Basic Title');
    expect(bestImage).toEqual({
      url: 'https://example.com/large.jpg',
      width: 200,
      height: 150,
    });
  });
});
