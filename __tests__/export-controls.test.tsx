import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportControls from '../components/ExportControls';
import { exportElementAsPng } from '../lib/images';
import { useEditorStore } from '../lib/editorStore';

jest.mock('../lib/images', () => ({
  exportElementAsPng: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
  useEditorStore.setState({
    title: '',
    subtitle: '',
    theme: 'light',
    layout: 'left',
    accentColor: '#3b82f6',
    bannerUrl: undefined,
    logoUrl: undefined,
    logoPosition: { x: 0, y: 0 },
    logoScale: 1,
    invertLogo: false,
    removeLogoBg: false,
    maskLogo: false,
  });
  document.body.innerHTML = '<div id="og-canvas"></div>';
});

describe('ExportControls', () => {
  it('exports using selected pixel ratio', async () => {
    render(<ExportControls />);
    fireEvent.change(screen.getByLabelText(/resolução/i), { target: { value: '2' } });
    fireEvent.click(screen.getByText(/Exportar PNG/i));
    await waitFor(() => {
      expect(exportElementAsPng).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.any(Object),
        expect.stringContaining('@2x'),
        { pixelRatio: 2 }
      );
    });
  });
});
