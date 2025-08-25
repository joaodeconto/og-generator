import { render, screen, fireEvent } from '@testing-library/react';
import { useMetadataStore } from '../lib/metadataStore';
import { useEditorStore } from '../lib/editorStore';

jest.mock('../lib/randomStyle', () => ({
  generateRandomPreset: jest.fn(() => ({
    theme: 'dark',
    layout: 'center',
    accentColor: '#000000'
  }))
}));

import Inspector from '../components/editor/Inspector';

describe('Inspector tabs', () => {
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
      theme: 'light',
      layout: 'left',
      accentColor: '#3b82f6',
      bannerUrl: undefined,
      logoFile: undefined,
      logoUrl: undefined,
      logoPosition: { x: 0, y: 0 },
      logoScale: 1,
      invertLogo: false,
      removeLogoBg: false,
      maskLogo: false,
      presets: []
    });
  });

  it('updates metadata store via Metadata tab', () => {
    render(<Inspector />);
    fireEvent.click(screen.getByRole('button', { name: /metadata/i }));
    fireEvent.change(screen.getByLabelText(/nome do site/i), {
      target: { value: 'My Site' }
    });
    expect(useMetadataStore.getState().siteName).toBe('My Site');
  });

  it('generates and applies preset via Presets tab', () => {
    render(<Inspector />);
    fireEvent.click(screen.getByRole('button', { name: /presets/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /gerar preset aleatório/i })
    );
    const state = useEditorStore.getState();
    expect(state.presets).toHaveLength(1);
    expect(state.theme).toBe('dark');
    expect(state.layout).toBe('center');
    expect(state.accentColor).toBe('#000000');
  });
});
