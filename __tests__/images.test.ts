
import { blobToDataURL, invertImageColors, exportElementAsPng, sanitizeSvg, svgToPng } from '../lib/images';
import * as htmlToImage from 'html-to-image';

jest.mock('html-to-image', () => ({
  toPng: jest.fn().mockResolvedValue('data:image/png;base64,'),
}));

afterEach(() => {
  jest.restoreAllMocks();
  // ensure document.fonts doesn't leak across tests
  // @ts-ignore
  delete document.fonts;
});

describe('image utilities', () => {
  it('converts Blob to data URL', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const dataUrl = await blobToDataURL(blob);
    expect(dataUrl).toMatch(/^data:text\/plain;base64,/);
  });

  it('rejects when FileReader errors', async () => {
    const blob = new Blob(['x']);
    const original = FileReader;
    class MockReader {
      onloadend: (() => void) | null = null;
      onerror: ((err: any) => void) | null = null;
      readAsDataURL() {
        this.onerror && this.onerror(new Error('fail'));
      }
    }
    // @ts-ignore
    global.FileReader = MockReader;
    await expect(blobToDataURL(blob)).rejects.toThrow('fail');
    // @ts-ignore
    global.FileReader = original;
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
    const putData = (mockCtx.putImageData as jest.Mock).mock.calls[0][0].data as Uint8ClampedArray;
    expect(Array.from(putData)).toEqual([255, 255, 255, 255]);
  });

  it('rejects when canvas context is missing', async () => {
    const redPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgSDAvzcAAAAASUVORK5CYII=';

    const mockCanvas = {
      getContext: () => null,
      width: 0,
      height: 0,
    } as any;

    const createElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return mockCanvas;
      return createElement(tag) as any;
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

    await expect(invertImageColors(redPixel)).rejects.toThrow('Failed to obtain canvas context');
  });

  it('sanitizes SVG content', () => {
    const dirty =
      '<svg><script>alert(1)</script><rect onclick="foo()" fill="red" /></svg>';
    const clean = sanitizeSvg(dirty);
    expect(clean).not.toMatch(/script/);
    expect(clean).not.toMatch(/onclick/);
    expect(clean).toMatch(/rect/);
  });

  it('rasterizes sanitized SVG to PNG', async () => {
    const mockCtx = { drawImage: jest.fn() } as any;

    class MockOffscreenCanvas {
      width: number;
      height: number;
      constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
      }
      getContext() {
        return mockCtx;
      }
      convertToBlob() {
        return Promise.resolve(new Blob(['png'], { type: 'image/png' }));
      }
    }
    // @ts-ignore
    global.OffscreenCanvas = MockOffscreenCanvas;

    class MockImage {
      width = 1;
      height = 1;
      onload: (() => void) | null = null;
      onerror: ((err?: any) => void) | null = null;
      set src(_value: string) {
        this.onload && this.onload();
      }
    }
    // @ts-ignore
    global.Image = MockImage;

    (global.URL as any).createObjectURL = jest
      .fn()
      .mockReturnValue('blob:mock-url');
    (global.URL as any).revokeObjectURL = jest.fn();

    const blob = await svgToPng('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(blob.type).toBe('image/png');
  });

    it('waits for fonts and respects pixelRatio when exporting', async () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'clientWidth', { value: 100 });
      Object.defineProperty(element, 'clientHeight', { value: 50 });

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

    it('exports even if document.fonts is missing', async () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'clientWidth', { value: 100 });
      Object.defineProperty(element, 'clientHeight', { value: 50 });

      await exportElementAsPng(element, { width: 200, height: 100 }, 'test.png');

      const toPngMock = htmlToImage.toPng as jest.Mock;
      expect(toPngMock).toHaveBeenCalled();
    });

    it('ignores bounding box transforms when scaling for export', async () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'clientWidth', { value: 100 });
      Object.defineProperty(element, 'clientHeight', { value: 50 });
      element.getBoundingClientRect = () => ({ width: 50, height: 25 } as any);
      // @ts-ignore
      document.fonts = { ready: Promise.resolve() };

      await exportElementAsPng(element, { width: 200, height: 100 }, 'test.png');

      const toPngMock = htmlToImage.toPng as jest.Mock;
      expect(toPngMock).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          width: 200,
          height: 100,
          style: expect.objectContaining({
            transform: 'scale(2, 2)',
            width: '100px',
            height: '50px',
          }),
        })
      );
    });
});

