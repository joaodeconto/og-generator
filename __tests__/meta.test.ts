import { buildMetaTags, copyMetaTags, escapeHtml } from '../lib/meta';

describe('meta builder', () => {
  it('escapes HTML special chars', () => {
    expect(escapeHtml(`Tom & Jerry <script>`)).toBe('Tom &amp; Jerry &lt;script&gt;');
  });

  it('builds full meta tag block', () => {
    const html = buildMetaTags({
      title: 'Hello',
      description: "desc with 'quotes'",
      image: 'https://img.test/og.png',
      url: 'https://example.com',
      siteName: 'My Site',
      twitterSite: '@tw',
    });
    expect(html).toContain('<meta property="og:title" content="Hello" />');
    expect(html).toContain('<meta name="twitter:description" content="desc with &#39;quotes&#39;" />');
    expect(html).toContain('<meta property="og:image" content="https://img.test/og.png" />');
    expect(html).toContain('<meta name="description" content="desc with &#39;quotes&#39;" />');
    expect(html).toContain('<meta name="twitter:site" content="@tw" />');
  });

  it('copies meta tags to clipboard', async () => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    await copyMetaTags({ title: 'Hello' });
    expect((navigator.clipboard as any).writeText).toHaveBeenCalledWith(
      buildMetaTags({ title: 'Hello' })
    );
  });
});
