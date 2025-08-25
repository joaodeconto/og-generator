export interface MetaOptions {
  title: string;
  description: string;
  image?: string;
}

export function buildMetaTags({ title, description, image }: MetaOptions): string {
  const tags = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    image ? `<meta property="og:image" content="${image}" />` : null,
    `<meta name="twitter:card" content="summary_large_image" />`
  ];
  return tags.filter(Boolean).join('\n');
}

export async function copyMetaTags(options: MetaOptions): Promise<void> {
  const tags = buildMetaTags(options);
  await navigator.clipboard.writeText(tags);
}
