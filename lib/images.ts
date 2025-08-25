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

/**
 * Sanitize an SVG string by removing disallowed tags and attributes.
 * This uses a small whitelist approach to guard against script injection.
 */
export function sanitizeSvg(svg: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const allowedTags = new Set([
    'svg',
    'g',
    'path',
    'rect',
    'circle',
    'ellipse',
    'line',
    'polyline',
    'polygon',
    'text',
    'tspan',
    'defs',
    'clipPath',
    'use',
    'image',
    'linearGradient',
    'radialGradient',
    'stop',
    'mask',
    'pattern',
    'filter',
    'metadata'
  ]);
  const allowedAttrs = new Set([
    'd',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-dasharray',
    'stroke-dashoffset',
    'opacity',
    'transform',
    'viewBox',
    'xmlns',
    'width',
    'height',
    'x',
    'y',
    'x1',
    'y1',
    'x2',
    'y2',
    'rx',
    'ry',
    'cx',
    'cy',
    'r',
    'points',
    'offset',
    'stop-color',
    'stop-opacity',
    'style',
    'class',
    'id',
    'xlink:href',
    'href',
    'filter',
    'mask',
    'clip-path'
  ]);

  const sanitizeElement = (el: Element) => {
    if (!allowedTags.has(el.tagName)) {
      el.remove();
      return;
    }
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name;
      const value = attr.value;
      if (
        !allowedAttrs.has(name) ||
        name.startsWith('on') ||
        /javascript:/i.test(value)
      ) {
        el.removeAttribute(name);
      }
    });
    Array.from(el.children).forEach((child) => sanitizeElement(child as Element));
  };

  sanitizeElement(doc.documentElement);
  return new XMLSerializer().serializeToString(doc.documentElement);
}

/**
 * Convert a sanitized SVG string to a PNG Blob using an offscreen canvas.
 */
export async function svgToPng(svg: string): Promise<Blob> {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const canvas =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(img.width, img.height)
        : (() => {
            const c = document.createElement('canvas');
            c.width = img.width;
            c.height = img.height;
            return c;
          })();
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to obtain canvas context');
    }
    ctx.drawImage(img, 0, 0);
    if ('convertToBlob' in canvas) {
      return await (canvas as OffscreenCanvas).convertToBlob({ type: 'image/png' });
    }
    return await new Promise<Blob>((resolve, reject) => {
      (canvas as HTMLCanvasElement).toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('toBlob failed'));
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
