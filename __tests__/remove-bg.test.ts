import { Blob } from 'buffer';

describe('removeImageBackground', () => {
  let OriginalWorker: any;

  beforeEach(() => {
    OriginalWorker = global.Worker;
  });

  afterEach(() => {
    global.Worker = OriginalWorker;
    jest.resetModules();
  });

  it('delegates processing to worker and resolves with data URL', async () => {
    const listeners: Record<string, Function[]> = { message: [], error: [] };
    const mockWorkerInstance = {
      addEventListener: jest.fn((type: string, cb: any) => {
        (listeners[type] ||= []).push(cb);
      }),
      removeEventListener: jest.fn(),
      postMessage: jest.fn(({ id }: any) => {
        listeners.message.forEach((fn) => fn({ data: { id, dataUrl: 'mock-data-url' } }));
      }),
    } as unknown as Worker;
    (global as any).Worker = jest.fn(() => mockWorkerInstance);

    const { removeImageBackground } = await import('../lib/removeBg');
    const src = new Blob(['src']);
    const result = await removeImageBackground(src);
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

  it('rejects if worker returns error', async () => {
    const listeners: Record<string, Function[]> = { message: [], error: [] };
    const mockWorkerInstance = {
      addEventListener: jest.fn((type: string, cb: any) => {
        (listeners[type] ||= []).push(cb);
      }),
      removeEventListener: jest.fn(),
      postMessage: jest.fn(({ id }: any) => {
        listeners.message.forEach((fn) => fn({ data: { id, error: 'fail' } }));
      }),
    } as unknown as Worker;
    (global as any).Worker = jest.fn(() => mockWorkerInstance);

    const { removeImageBackground } = await import('../lib/removeBg');
    await expect(removeImageBackground('img')).rejects.toThrow('fail');
   main
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
