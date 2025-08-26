export function ensureSameOriginImage(raw?: string): string | undefined {
  if (!raw) return undefined;

  // quick accepts
  if (raw.startsWith('/api/image')) return raw;         // already proxied
  if (raw.startsWith('/')) return raw;                // same-origin path
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return raw;

  // http(s) → proxy; anything else → leave as-is
  try {
    const u = new URL(raw, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    if (u.protocol === 'http:' || u.protocol === 'https:') {
      return `/api/image?url=${encodeURIComponent(u.toString())}`;
    }
    return raw;
  } catch {
    // if it wasn't a valid absolute URL, treat as a relative path
    return raw;
  }
}
