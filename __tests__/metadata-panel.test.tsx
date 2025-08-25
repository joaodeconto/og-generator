import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MetadataPanel from '../components/MetadataPanel';
import { useMetadataStore } from '../lib/metadataStore';
import { useEditorStore } from '../lib/editorStore';

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
    useEditorStore.setState({
      title: '',
      subtitle: '',
      bannerUrl: undefined,
      logoUrl: undefined
    });
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('fetches metadata and populates the form', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => ({
        title: 'Example Title',
        description: 'Example description',
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
    expect(screen.getByDisplayValue('Example description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/image.png')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/favicon.ico')).toBeInTheDocument();
    expect(await screen.findByText('a warning')).toBeInTheDocument();

    const state = useEditorStore.getState();
    expect(state.title).toBe('Example Title');
    expect(state.subtitle).toBe('Example description');
    expect(state.bannerUrl).toBe('https://example.com/image.png');
    expect(state.logoUrl).toBe('https://example.com/favicon.ico');
  });
});
