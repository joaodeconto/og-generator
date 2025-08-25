import { render, screen } from '@testing-library/react';
import CanvasStage from '../components/editor/CanvasStage';
import { useEditorStore } from '../lib/editorStore';

describe('Editor CanvasStage', () => {
  beforeEach(() => {
    useEditorStore.setState({
      title: 'Hello World',
      subtitle: 'Subheading',
      bannerUrl: 'https://example.com/banner.png',
      logoUrl: undefined,
      logoFile: undefined,
    });
  });

  it('renders title and subtitle from store', () => {
    render(<CanvasStage />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Subheading')).toBeInTheDocument();
  });

  it('renders banner image using img tag', () => {
    render(<CanvasStage />);
    const banner = screen.getByAltText('Banner image') as HTMLImageElement;
    expect(banner).toBeInTheDocument();
    expect(banner.tagName).toBe('IMG');
    expect(banner.getAttribute('src')).toBe('https://example.com/banner.png');
  });

  it('positions the logo at the center by default', () => {
    useEditorStore.setState({ logoUrl: 'https://example.com/logo.png' });
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const container = logo.parentElement as HTMLElement;
    expect(container).toHaveStyle({ top: '50%', left: '50%' });
  });
});
