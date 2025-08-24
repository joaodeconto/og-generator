import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MetadataPanel from '../components/MetadataPanel';
import { useMetadataStore } from '../lib/metadataStore';

describe('MetadataPanel', () => {
  beforeEach(() => {
    useMetadataStore.setState({
      description: '',
      image: '',
      favicon: '',
      siteName: '',
      sourceMap: {},
      warnings: []
    });
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('fetches metadata and populates the form', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => ({
        title: 'Example Title',
        image: 'https://example.com/image.png',
        favicon: 'https://example.com/favicon.ico',
        warnings: ['a warning']
      })
    })) as any;

    render(<MetadataPanel />);

    fireEvent.change(screen.getByLabelText(/^url$/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /fetch metadata/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Example Title')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('https://example.com/image.png')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/favicon.ico')).toBeInTheDocument();
    expect(await screen.findByText('a warning')).toBeInTheDocument();
  });
});
