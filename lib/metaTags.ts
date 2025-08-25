export interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  twitterSite?: string;
}

/**
 * Build a string of Open Graph and Twitter meta tags based on provided options.
 */
export function buildMetaTags({ title, description, image, url, siteName, twitterSite }: MetaOptions): string {
  const tags: string[] = [];
  if (title) {
    tags.push(`<meta property="og:title" content="${title}" />`);
    tags.push(`<meta name="twitter:title" content="${title}" />`);
  }
  if (description) {
    tags.push(`<meta property="og:description" content="${description}" />`);
    tags.push(`<meta name="twitter:description" content="${description}" />`);
  }
  tags.push('<meta property="og:type" content="website" />');
  if (url) tags.push(`<meta property="og:url" content="${url}" />`);
  if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}" />`);
  if (image) {
    tags.push(`<meta property="og:image" content="${image}" />`);
    tags.push(`<meta name="twitter:image" content="${image}" />`);
  }
  tags.push('<meta name="twitter:card" content="summary_large_image" />');
  if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
  return tags.join('\n');
}
