import { buildMetaTags, copyMetaTags } from '../lib/meta';

describe('meta helpers', () => {
  it('builds meta tag block', () => {
    const tags = buildMetaTags({ title: 'Title', description: 'Desc', image: 'img.png' });
    expect(tags).toContain('<meta property="og:title" content="Title" />');
    expect(tags).toContain('<meta property="og:description" content="Desc" />');
    expect(tags).toContain('<meta property="og:type" content="website" />');
    expect(tags).toContain('<meta property="og:image" content="img.png" />');
    expect(tags).toContain('<meta name="twitter:image" content="img.png" />');
  });

  it('writes tags to clipboard', async () => {
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    await copyMetaTags({ title: 't', description: 'd' });
    expect(writeText).toHaveBeenCalled();
  });

  it('adds url tag when url is provided', () => {
    const tags = buildMetaTags({ title: 'T', description: 'D', url: 'https://x.com' });
    expect(tags).toContain('<meta property="og:url" content="https://x.com" />');
  });
});
