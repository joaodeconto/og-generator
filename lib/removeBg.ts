import { removeBackground } from "@imgly/background-removal";
import { blobToDataURL } from './images';

/**
 * Remove the background of an image using a preferred method.
 * Tries the server-side API first when allowed and falls back to
 * client-side processing.
 *
 * @param source File, Blob, or URL string pointing to an image
 * @param preferServer Whether to attempt the server API first
 * @returns A base64 data URL of the processed image
 */
export async function removeImageBackground(source: Blob | string, preferServer = true): Promise<string> {
  if (preferServer) {
    try {
      const formData = new FormData();
      formData.append('image', source);
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const blob = await res.blob();
        return blobToDataURL(blob);
      }
    } catch {
      // ignore and fall back to client-side path
    }
  }

  if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
    try {
      Object.defineProperty(navigator, "hardwareConcurrency", {
        configurable: true,
        get: () => 1,
      });
    } catch {
      // ignore inability to override
    }
  }

  const blob = await removeBackground(source);
  return blobToDataURL(blob);
}
