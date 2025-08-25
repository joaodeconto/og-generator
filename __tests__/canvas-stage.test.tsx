import { render, screen } from '@testing-library/react';
import CanvasStage from '../components/CanvasStage';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasStage', () => {
  beforeEach(() => {
    useEditorStore.setState({
      title: '',
      subtitle: '',
      bannerUrl: 'https://example.com/banner.png',
      logoFile: undefined,
      logoUrl: undefined,
    });
  });

  it('renders banner image using img tag', () => {
    render(<CanvasStage />);
    const banner = screen.getByAltText('Banner image') as HTMLImageElement;
    expect(banner).toBeInTheDocument();
    expect(banner.tagName).toBe('IMG');
    expect(banner.getAttribute('src')).toBe('https://example.com/banner.png');
  });
});
