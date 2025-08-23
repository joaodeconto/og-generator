import { blobToDataURL, invertImageColors } from '../lib/images';

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
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return mockCanvas;
      return document.createElement(tag) as any;
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
});
