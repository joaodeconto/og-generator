export interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  twitterSite?: string;
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
export function buildMetaTags({
  title,
  description,
  image,
  url,
  siteName,
  twitterSite,
}: MetaOptions): string {
  const safeTitle = title ? escapeHtml(title) : undefined;
  const safeDescription = description ? escapeHtml(description) : undefined;
  const safeImage = image ? escapeHtml(image) : undefined;
  const safeUrl = url ? escapeHtml(url) : undefined;
  const safeSiteName = siteName ? escapeHtml(siteName) : undefined;
  const safeTwitterSite = twitterSite ? escapeHtml(twitterSite) : undefined;

  const tags: string[] = [];
  if (safeTitle) {
    tags.push(`<meta property="og:title" content="${safeTitle}" />`);
    tags.push(`<meta name="twitter:title" content="${safeTitle}" />`);
  }
  if (safeDescription) {
    tags.push(`<meta property="og:description" content="${safeDescription}" />`);
    tags.push(`<meta name="twitter:description" content="${safeDescription}" />`);
    tags.push(`<meta name="description" content="${safeDescription}" />`);
  }
  tags.push(`<meta property="og:type" content="website" />`);
  if (safeUrl) {
    tags.push(`<meta property="og:url" content="${safeUrl}" />`);
  }
  if (safeSiteName) {
    tags.push(`<meta property="og:site_name" content="${safeSiteName}" />`);
  }
  if (safeImage) {
    tags.push(`<meta property="og:image" content="${safeImage}" />`);
    tags.push(`<meta name="twitter:image" content="${safeImage}" />`);
  }
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  if (safeTwitterSite) {
    tags.push(`<meta name="twitter:site" content="${safeTwitterSite}" />`);
  }
  return tags.join('\n');
}

export async function copyMetaTags(options: MetaOptions): Promise<void> {
  const tags = buildMetaTags(options);
  try {
    await navigator.clipboard.writeText(tags);
  } catch (err) {
    return Promise.reject(err);
  }
}
