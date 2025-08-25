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

  it('propagates clipboard errors', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('denied'));
    Object.assign(navigator, { clipboard: { writeText } });
    await expect(copyMetaTags({ title: 't' })).rejects.toThrow('denied');
  });

  it('adds url tag when url is provided', () => {
    const tags = buildMetaTags({ title: 'T', description: 'D', url: 'https://x.com' });
    expect(tags).toContain('<meta property="og:url" content="https://x.com" />');
  });

  it('supports optional fields', () => {
    const tags = buildMetaTags({
      title: 'Title',
      description: 'Desc',
      image: 'https://example.com/img.png',
      url: 'https://example.com',
      siteName: 'Example',
      twitterSite: '@example',
    });
    expect(tags).toContain('<meta property="og:site_name" content="Example" />');
    expect(tags).toContain('<meta name="twitter:site" content="@example" />');
  });

  it('omits tags for missing fields', () => {
    const tags = buildMetaTags({ title: 'Only' });
    expect(tags).not.toContain('og:description');
    expect(tags).not.toContain('twitter:description');
  });

  it('escapes special HTML characters', () => {
    const tags = buildMetaTags({
      title: 'Tom & "Jerry" <Best>',
      description: 'It\'s > all "fun" & games',
      image: 'img?id=1&mode=<',
      url: 'https://x.com/?q=a&b',
    });
    expect(tags).toContain('<meta property="og:title" content="Tom &amp; &quot;Jerry&quot; &lt;Best&gt;" />');
    expect(tags).toContain('<meta property="og:description" content="It&#39;s &gt; all &quot;fun&quot; &amp; games" />');
    expect(tags).toContain('<meta property="og:image" content="img?id=1&amp;mode=&lt;" />');
    expect(tags).toContain('<meta property="og:url" content="https://x.com/?q=a&amp;b" />');
  });
});
