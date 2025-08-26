import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MetadataPanel from '../components/editor/panels/MetadataPanel';
import { useMetadataStore } from '../lib/metadataStore';
import { toast } from '../components/ToastProvider';

jest.mock('../components/ToastProvider', () => ({
  toast: jest.fn(),
}));

describe('MetadataPanel', () => {
  beforeEach(() => {
    useMetadataStore.setState({
      description: '',
      image: '',
      favicon: '',
      siteName: '',
      warnings: [],
    });
    (global.fetch as jest.Mock | undefined) = jest.fn();
  });

  it('shows warning when scrape fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'fail' }),
    });

    render(<MetadataPanel />);
    fireEvent.change(screen.getByPlaceholderText('https://exemplo.com'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /fetch metadata/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ message: 'fail', variant: 'error' });
    });
    expect(useMetadataStore.getState().warnings).toEqual(['fail']);
  });
});
