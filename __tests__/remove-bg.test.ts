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
  });
});
