import { buildMetaTags } from '../lib/metaTags';

describe('buildMetaTags', () => {
  it('creates OG and Twitter meta tags', () => {
    const tags = buildMetaTags({
      title: 'Title',
      description: 'Desc',
      image: 'https://example.com/img.png',
      url: 'https://example.com',
      siteName: 'Example',
      twitterSite: '@example'
    });

    expect(tags).toContain('<meta property="og:title" content="Title" />');
    expect(tags).toContain('<meta property="og:description" content="Desc" />');
    expect(tags).toContain('<meta property="og:image" content="https://example.com/img.png" />');
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(tags).toContain('<meta name="twitter:image" content="https://example.com/img.png" />');
  });

  it('omits tags for missing fields', () => {
    const tags = buildMetaTags({ title: 'Only' });
    expect(tags).not.toContain('og:description');
    expect(tags).not.toContain('og:image');
  });
});
