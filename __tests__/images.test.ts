import { blobToDataURL, invertImageColors, exportElementAsPng } from '../lib/images';
import * as htmlToImage from 'html-to-image';

jest.mock('html-to-image', () => ({
  toPng: jest.fn().mockResolvedValue('data:image/png;base64,'),
}));

describe('image utilities', () => {
  it('converts Blob to data URL', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const dataUrl = await blobToDataURL(blob);
    expect(dataUrl).toMatch(/^data:text\/plain;base64,/);
  });

  it('inverts image colors', async () => {
    const redPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgSDAvzcAAAAASUVORK5CYII=';

    const mockCtx = {
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray([255, 0, 0, 255]), width: 1, height: 1 })),
      putImageData: jest.fn(),
    } as any;
    const mockCanvas = {
      getContext: () => mockCtx,
      toDataURL: () => redPixel,
      width: 0,
      height: 0,
    } as any;
    const createElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return mockCanvas;
      return createElement(tag);
    });

    class MockImage {
      width = 1;
      height = 1;
      crossOrigin = '';
      onload: (() => void) | null = null;
      onerror: ((err?: any) => void) | null = null;
      set src(_value: string) {
        this.onload && this.onload();
      }
    }
    // @ts-ignore
    global.Image = MockImage;

    const inverted = await invertImageColors(redPixel);
    expect(inverted.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('waits for fonts and respects pixelRatio when exporting', async () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({ width: 100, height: 50 } as any);

    let resolveFonts: () => void;
    // @ts-ignore
    document.fonts = { ready: new Promise<void>((r) => (resolveFonts = r)) };

    const exportPromise = exportElementAsPng(
      element,
      { width: 200, height: 100 },
      'test.png',
      { pixelRatio: 2 }
    );

    const toPngMock = htmlToImage.toPng as jest.Mock;
    expect(toPngMock).not.toHaveBeenCalled();

    resolveFonts();
    await exportPromise;

    expect(toPngMock).toHaveBeenCalledWith(
      element,
      expect.objectContaining({ pixelRatio: 2 })
    );
  });
});
