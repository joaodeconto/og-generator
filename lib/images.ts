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
  const { width: originalWidth, height: originalHeight } =
    element.getBoundingClientRect();

  const scaleX = size.width / originalWidth;
  const scaleY = size.height / originalHeight;

  const dataUrl = await toPng(element, {
    width: size.width,
    height: size.height,
    style: {
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: 'top left',
      width: `${originalWidth}px`,
      height: `${originalHeight}px`
    },
    pixelRatio: 1
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
