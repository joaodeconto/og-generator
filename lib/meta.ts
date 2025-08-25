export interface MetaOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Build a block of Open Graph and Twitter meta tags.
 */
export function buildMetaTags({ title, description, image, url }: MetaOptions): string {
  const tags: string[] = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];
  if (image) {
    tags.push(`<meta property="og:image" content="${image}" />`);
    tags.push(`<meta name="twitter:image" content="${image}" />`);
  }
  if (url) {
    tags.push(`<meta property="og:url" content="${url}" />`);
  }
  return tags.join('\n');
}

export async function copyMetaTags(options: MetaOptions): Promise<void> {
  const tags = buildMetaTags(options);
  await navigator.clipboard.writeText(tags);

}
