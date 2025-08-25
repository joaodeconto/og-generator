import { removeBackground } from "@imgly/background-removal";
import { blobToDataURL } from './images';

/**
 * Remove the background of an image using @imgly/background-removal.
 *
 * @param source File, Blob, or URL string pointing to an image
 * @returns A base64 data URL of the processed image
 */
export async function removeImageBackground(source: Blob | string): Promise<string> {
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
  if (!(blob instanceof Blob)) {
    throw new Error("removeBackground did not return a Blob");
  }
  return blobToDataURL(blob);
}
