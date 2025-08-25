import { buildMetaTags, copyMetaTags } from '../lib/meta';

describe('meta helpers', () => {
  it('builds meta tag block', () => {
    const tags = buildMetaTags({
      title: 'Title',
      description: 'Desc',
      image: 'img.png',
    });
    expect(tags).toBe(
      `<meta property="og:title" content="Title" />\n` +
        `<meta property="og:description" content="Desc" />\n` +
        `<meta property="og:type" content="website" />\n` +
        `<meta property="og:image" content="img.png" />\n` +
        `<meta name="twitter:card" content="summary_large_image" />`
    );
  });

  it('writes tags to clipboard', async () => {
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    await copyMetaTags({ title: 't', description: 'd' });
    expect(writeText).toHaveBeenCalled();
  });
});
