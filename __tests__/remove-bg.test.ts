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

  function mockWorker(response: { error?: string; dataUrl?: string }) {
    const listeners: Record<string, Function[]> = { message: [], error: [] };
    const mockWorkerInstance = {
      addEventListener: jest.fn((type: string, cb: any) => {
        (listeners[type] ||= []).push(cb);
      }),
      removeEventListener: jest.fn(),
      postMessage: jest.fn(({ id }: any) => {
        if (response.error) {
          listeners.message.forEach((fn) => fn({ data: { id, error: response.error } }));
        } else {
          listeners.message.forEach((fn) => fn({ data: { id, dataUrl: response.dataUrl } }));
        }
      }),
    } as unknown as Worker;
    (global as any).Worker = jest.fn(() => mockWorkerInstance);
  }

  it('delegates processing to worker and resolves with data URL', async () => {
    mockWorker({ dataUrl: 'mock-data-url' });
    const { removeImageBackground } = await import('../lib/removeBg');
    const src = new Blob(['src']);
    const result = await removeImageBackground(src);
    expect(result).toBe('mock-data-url');
  });

  it('rejects if worker returns error', async () => {
    mockWorker({ error: 'fail' });
    const { removeImageBackground } = await import('../lib/removeBg');
    await expect(removeImageBackground('img')).rejects.toThrow('fail');
  });

  it('reuses existing worker on subsequent calls', async () => {
    mockWorker({ dataUrl: 'again' });
    const { removeImageBackground } = await import('../lib/removeBg');
    await removeImageBackground('first');
    const result = await removeImageBackground('second');
    expect(result).toBe('again');
    expect(Worker).toHaveBeenCalledTimes(1);
  });
});

