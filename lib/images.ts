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

/**
 * Convert a Blob into a base64 data URL string.
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Invert all colors of an image represented by a data URL.
 *
 * @param dataUrl base64 encoded image source
 * @returns data URL of the inverted image
 */
export async function invertImageColors(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to obtain canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
