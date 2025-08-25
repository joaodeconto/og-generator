export interface MetaOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Escape HTML special characters to prevent breaking out of attribute values.
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (ch) => map[ch]);
}

/**
 * Build a block of Open Graph and Twitter meta tags.
 */
export function buildMetaTags({ title, description, image, url }: MetaOptions): string {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = image ? escapeHtml(image) : undefined;
  const safeUrl = url ? escapeHtml(url) : undefined;

  const tags: string[] = [
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDescription}" />`,
  ];
  if (safeImage) {
    tags.push(`<meta property="og:image" content="${safeImage}" />`);
    tags.push(`<meta name="twitter:image" content="${safeImage}" />`);
  }
  if (safeUrl) {
    tags.push(`<meta property="og:url" content="${safeUrl}" />`);
  }
  return tags.join('\n');
}

export async function copyMetaTags(options: MetaOptions): Promise<void> {
  const tags = buildMetaTags(options);
  await navigator.clipboard.writeText(tags);

}
