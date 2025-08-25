import { buildMetaTags } from '../lib/meta';

describe('buildMetaTags', () => {
  it('builds OG and Twitter meta tags', () => {
    const tags = buildMetaTags({
      title: 'Hello',
      description: 'World',
      image: 'https://example.com/img.png',
      url: 'https://example.com',
    });
    expect(tags).toContain('<meta property="og:title" content="Hello" />');
    expect(tags).toContain('<meta property="og:description" content="World" />');
    expect(tags).toContain('<meta property="og:image" content="https://example.com/img.png" />');
    expect(tags).toContain('<meta property="og:url" content="https://example.com" />');
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });
});
