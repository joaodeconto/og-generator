import { render, screen } from '@testing-library/react';
import CanvasStage from '../components/CanvasStage';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasStage', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
    useEditorStore.setState({
      title: '',
      subtitle: '',
      bannerUrl: 'https://example.com/banner.png',
      logoFile: undefined,
      logoUrl: undefined,
    });
  });

  it('renders a single banner image using img tag', () => {
    render(<CanvasStage />);
    const banners = screen.getAllByAltText('Banner image') as HTMLImageElement[];
    expect(banners).toHaveLength(1);
    expect(banners[0].tagName).toBe('IMG');
    expect(banners[0].getAttribute('src')).toContain('banner.png');
  });

  it('exports element has fixed base dimensions', () => {
    render(<CanvasStage />);
    const canvas = document.getElementById('og-canvas') as HTMLElement;
    expect(canvas).toHaveStyle({ width: '1200px', height: '630px' });
  });

  it('positions the logo at the center by default', () => {
    useEditorStore.setState({ logoUrl: 'https://example.com/logo.png' });
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const container = logo.parentElement as HTMLElement;
    expect(container).toHaveStyle({ top: '50%', left: '50%' });
  });

  it('positions title and subtitle at the center by default', () => {
    useEditorStore.setState({ title: 'Hello', subtitle: 'World' });
    render(<CanvasStage />);
    const titleEl = screen.getByText('Hello');
    const titleWrapper = titleEl.parentElement as HTMLElement;
    expect(titleWrapper).toHaveStyle({ top: '50%', left: '50%' });
    const subtitleEl = screen.getByText('World');
    const subtitleWrapper = subtitleEl.parentElement as HTMLElement;
    expect(subtitleWrapper).toHaveStyle({ top: '50%', left: '50%' });
  });

  it('renders images without crossOrigin attribute by default', () => {
    useEditorStore.setState({
      bannerUrl: 'https://example.com/banner.png',
      logoUrl: 'https://example.com/logo.png'
    });
    render(<CanvasStage />);
    const banner = screen.getByAltText('Banner image') as HTMLImageElement;
    const logo = screen.getByAltText('Logo') as HTMLImageElement;
    expect(banner.getAttribute('crossorigin')).toBeNull();
    expect(logo.getAttribute('crossorigin')).toBeNull();
  });
});
