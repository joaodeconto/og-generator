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
    const banners = screen.getAllByAltText('Banner image') as HTMLImageElement[];
    expect(banners[0]).toBeInTheDocument();
    expect(banners[0].tagName).toBe('IMG');
    expect(banners[0].getAttribute('src')).toBe('https://example.com/banner.png');
  });

  it('positions the logo at the center by default', () => {
    useEditorStore.setState({ logoUrl: 'https://example.com/logo.png' });
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const container = logo.parentElement as HTMLElement;
    expect(container).toHaveStyle({ top: '50%', left: '50%' });
  });
});
