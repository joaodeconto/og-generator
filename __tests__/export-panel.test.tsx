import { fireEvent, render, screen } from '@testing-library/react';
import ExportPanel from '../components/editor/panels/ExportPanel';
import { useEditorStore } from '../lib/editorStore';
import { exportElementAsPng } from '../lib/images';
import { copyMetaTags } from '../lib/meta';

jest.mock('../lib/images', () => ({
  exportElementAsPng: jest.fn(),
}));

jest.mock('../lib/meta', () => ({
  copyMetaTags: jest.fn(),
}));

describe('ExportPanel', () => {
  beforeEach(() => {
    useEditorStore.setState({ title: 'T', subtitle: 'S' });
    document.body.innerHTML = '<div id="og-canvas"></div>';
  });

  it('exports canvas as PNG', () => {
    const mock = exportElementAsPng as jest.Mock;
    render(<ExportPanel />);
    fireEvent.click(screen.getByRole('button', { name: /export png/i }));
    expect(mock).toHaveBeenCalledWith(
      document.getElementById('og-canvas'),
      { width: 1200, height: 630 },
      'og-image-1200x630.png'
    );
  });

  it('copies meta tags', () => {
    const mock = copyMetaTags as jest.Mock;
    render(<ExportPanel />);
    fireEvent.click(screen.getByRole('button', { name: /copy meta/i }));
    expect(mock).toHaveBeenCalledWith({ title: 'T', description: 'S' });
  });
});
