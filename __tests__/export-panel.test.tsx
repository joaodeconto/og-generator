import { fireEvent, render, screen } from '@testing-library/react';
import ExportPanel from '../components/editor/panels/ExportPanel';
import { useEditorStore } from '../lib/editorStore';
import { exportElementAsPng } from '../lib/images';
import { buildMetaTags } from '../lib/meta';

jest.mock('../lib/images', () => ({
  exportElementAsPng: jest.fn(),
}));


describe('ExportPanel', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
    useEditorStore.setState({ title: 'T', subtitle: 'S' });
    document.body.innerHTML = '<div id="og-canvas"></div>';
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
  });

  it('exports canvas as PNG', () => {
    const mock = exportElementAsPng as jest.Mock;
    render(<ExportPanel />);
    fireEvent.click(screen.getByRole('button', { name: /export image as png/i }));
    expect(mock).toHaveBeenCalledWith(
      document.getElementById('og-canvas'),
      { width: 1200, height: 630 },
      'og-image-1200x630.png'
    );
  });

  it('changes export size when selecting a preset', () => {
    const mock = exportElementAsPng as jest.Mock;
    render(<ExportPanel />);
    const sizeBtn = screen.getByRole('button', { name: /export size 1600 by 900/i });
    fireEvent.click(sizeBtn);
    fireEvent.click(screen.getByRole('button', { name: /export image as png/i }));
    expect(mock).toHaveBeenCalledWith(
      document.getElementById('og-canvas'),
      { width: 1600, height: 900 },
      'og-image-1600x900.png'
    );
    expect(sizeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('copies meta tags', () => {
    render(<ExportPanel />);
    const expected = buildMetaTags({ title: 'T', description: 'S' });
    fireEvent.click(screen.getByRole('button', { name: /copy meta/i }));
    expect((navigator.clipboard as any).writeText).toHaveBeenCalledWith(expected);
  });
});
