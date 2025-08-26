import { renderHook, waitFor } from '@testing-library/react';
import useProcessedLogo from '../lib/hooks/useProcessedLogo';
import { removeImageBackground } from 'lib/removeBg';
import { invertImageColors } from 'lib/images';
import { ensureSameOriginImage } from 'lib/urls';

jest.mock('lib/removeBg', () => ({
  removeImageBackground: jest.fn(),
}));

jest.mock('lib/images', () => ({
  blobToDataURL: jest.fn(async () => 'data-url'),
  invertImageColors: jest.fn(async (url) => `inverted-${url}`),
}));

jest.mock('lib/urls', () => ({
  ensureSameOriginImage: jest.fn((url: string) => url),
}));

jest.mock('components/ToastProvider', () => ({
  toast: jest.fn(),
}));

describe('useProcessedLogo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removes background when enabled', async () => {
    (removeImageBackground as jest.Mock).mockResolvedValue('data-removed-url');
    (ensureSameOriginImage as jest.Mock).mockImplementation((url: string) =>
      url === 'logo.png' ? 'proxied-logo.png' : url,
    );
    const { result } = renderHook(() =>
      useProcessedLogo({
        logoUrl: 'logo.png',
        logoFile: undefined,
        removeLogoBg: true,
        invertLogo: false,
      })
    );
    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.logoDataUrl).toBe('data-removed-url'));
    expect(result.current.loading).toBe(false);
    expect(removeImageBackground).toHaveBeenCalledWith('proxied-logo.png');
    expect(ensureSameOriginImage).toHaveBeenNthCalledWith(1, 'logo.png');
    expect(ensureSameOriginImage).toHaveBeenNthCalledWith(2, 'data-removed-url');
  });

  it('inverts colors when enabled', async () => {
    (ensureSameOriginImage as jest.Mock).mockReturnValue('normalized-url');
    (invertImageColors as jest.Mock).mockResolvedValue('inverted-url');
    const { result } = renderHook(() =>
      useProcessedLogo({
        logoUrl: 'logo.png',
        logoFile: undefined,
        removeLogoBg: false,
        invertLogo: true,
      })
    );
    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.logoDataUrl).toBe('inverted-url'));
    expect(result.current.loading).toBe(false);
    expect(removeImageBackground).not.toHaveBeenCalled();
    expect(invertImageColors).toHaveBeenCalledWith('normalized-url');
  });
});

