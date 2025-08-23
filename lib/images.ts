import { toPng } from 'html-to-image';

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Render a DOM element to a PNG image and trigger download.
 *
 * @param element DOM node to render
 * @param size    Desired output resolution
 * @param filename Name for the downloaded file
 */
export async function exportElementAsPng(
  element: HTMLElement,
  size: ImageSize,
  filename = 'og-image.png'
): Promise<void> {
  const dataUrl = await toPng(element, {
    width: size.width,
    height: size.height,
    canvasWidth: size.width,
    canvasHeight: size.height
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
