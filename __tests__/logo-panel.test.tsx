import { render, screen, fireEvent, act } from '@testing-library/react';
import LogoPanel from '../components/editor/panels/LogoPanel';
import { useEditorStore } from '../lib/editorStore';

describe('LogoPanel', () => {
  beforeEach(() => {
    useEditorStore.setState({
      logoFile: undefined,
      logoUrl: undefined,
      removeLogoBg: false,
      invertLogo: false,
      maskLogo: false,
      logoScale: 1,
      logoPosition: { x: 10, y: 20 },
    });
  });

  it('handles file, paste and url inputs', async () => {
    render(<LogoPanel />);

    const file = new File(['img'], 'logo.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/logo file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(useEditorStore.getState().logoFile).toBe(file);

    (navigator as any).clipboard = {
      readText: jest.fn().mockResolvedValue('https://example.com/pasted.png'),
    };
    await act(async () => {
      fireEvent.click(screen.getByText(/paste/i));
    });
    expect(useEditorStore.getState().logoUrl).toBe('https://example.com/pasted.png');

    jest.spyOn(window, 'prompt').mockReturnValue('https://example.com/url.png');
    fireEvent.click(screen.getByText(/from url/i));
    expect(useEditorStore.getState().logoUrl).toBe('https://example.com/url.png');
    (window.prompt as jest.Mock).mockRestore();
  });

  it('toggles image processing flags', () => {
    render(<LogoPanel />);
    fireEvent.click(screen.getByText(/remove bg/i));
    expect(useEditorStore.getState().removeLogoBg).toBe(true);
    fireEvent.click(screen.getByText(/invert b\/w/i));
    expect(useEditorStore.getState().invertLogo).toBe(true);
    fireEvent.click(screen.getByText(/mask: circle/i));
    expect(useEditorStore.getState().maskLogo).toBe(true);
  });

  it('updates logo position via coordinate inputs', () => {
    render(<LogoPanel />);
    const xInput = screen.getByLabelText(/^x$/i);
    const yInput = screen.getByLabelText(/^y$/i);
    fireEvent.change(xInput, { target: { value: '30' } });
    fireEvent.change(yInput, { target: { value: '40' } });
    expect(useEditorStore.getState().logoPosition).toEqual({ x: 30, y: 40 });
  });

  it('adjusts scale and position', async () => {
    render(<LogoPanel />);
    fireEvent.change(screen.getByLabelText(/scale/i), { target: { value: '2' } });
    expect(useEditorStore.getState().logoScale).toBeCloseTo(2);

    await act(async () => {
      useEditorStore.setState({ logoPosition: { x: 30, y: 40 } });
    });
    fireEvent.click(screen.getByText(/center/i));
    expect(useEditorStore.getState().logoPosition).toEqual({ x: 50, y: 50 });

    await act(async () => {
      useEditorStore.setState({ logoScale: 2, logoPosition: { x: 60, y: 70 } });
    });
    fireEvent.click(screen.getByText(/reset/i));
    expect(useEditorStore.getState().logoScale).toBe(1);
    expect(useEditorStore.getState().logoPosition).toEqual({ x: 50, y: 50 });
  });

  it('sets logo position presets and supports undo/redo', () => {
    render(<LogoPanel />);
    fireEvent.click(screen.getByText(/top left/i));
    expect(useEditorStore.getState().logoPosition).toEqual({ x: 10, y: 10 });
    fireEvent.click(screen.getByText(/undo/i));
    expect(useEditorStore.getState().logoPosition).toEqual({ x: 10, y: 20 });
    fireEvent.click(screen.getByText(/redo/i));
    expect(useEditorStore.getState().logoPosition).toEqual({ x: 10, y: 10 });
  });
});

