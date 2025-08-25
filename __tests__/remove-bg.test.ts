const mockBlob = new Blob(['mock']);

jest.mock('@imgly/background-removal', () => ({
  removeBackground: jest.fn(async () => mockBlob),
}));

jest.mock('../lib/images', () => ({
  blobToDataURL: jest.fn(async () => 'mock-data-url'),
}));

import { removeImageBackground } from '../lib/removeBg';
import { removeBackground } from '@imgly/background-removal';
import { blobToDataURL } from '../lib/images';

describe('removeImageBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invokes background removal and returns data URL', async () => {
    const src = new Blob(['src']);
    const result = await removeImageBackground(src);

    expect(removeBackground).toHaveBeenCalledWith(src);
    expect(blobToDataURL).toHaveBeenCalledWith(mockBlob);
    expect(result).toBe('mock-data-url');
  });

  it('overrides navigator.hardwareConcurrency without throwing', async () => {
    (global as any).crossOriginIsolated = false;
    const defineSpy = jest.spyOn(Object, 'defineProperty');
    await expect(removeImageBackground('img')).resolves.toBe('mock-data-url');
    expect(defineSpy).toHaveBeenCalledWith(
      navigator,
      'hardwareConcurrency',
      expect.objectContaining({ configurable: true, get: expect.any(Function) }),
    );
    expect(navigator.hardwareConcurrency).toBe(1);

    defineSpy.mockRestore();
    delete (global as any).crossOriginIsolated;
  });

  it('handles failure to override hardwareConcurrency', async () => {
    (global as any).crossOriginIsolated = false;
    const original = Object.defineProperty;
    Object.defineProperty = jest.fn(() => { throw new Error('fail'); }) as any;

    await expect(removeImageBackground('img')).resolves.toBe('mock-data-url');
    expect(Object.defineProperty).toHaveBeenCalled();

    Object.defineProperty = original;
    delete (global as any).crossOriginIsolated;
  });

  it('throws if removeBackground does not return a Blob', async () => {
    (removeBackground as jest.Mock).mockResolvedValueOnce('not-blob' as any);
    await expect(removeImageBackground('img')).rejects.toThrow('removeBackground did not return a Blob');
  });
});

