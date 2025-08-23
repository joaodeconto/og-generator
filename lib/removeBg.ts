import { removeBackground } from "@imgly/background-removal";
import { blobToDataURL } from './images';

/**
 * Remove the background of an image using @imgly/background-removal.
 *
 * @param source File, Blob, or URL string pointing to an image
 * @returns A base64 data URL of the processed image
 */
export async function removeImageBackground(source: Blob | string): Promise<string> {
  const blob = await removeBackground(source);
  return blobToDataURL(blob);
}
