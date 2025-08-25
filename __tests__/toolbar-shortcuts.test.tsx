import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Toolbar from '../components/editor/Toolbar';
import { useEditorStore } from '../lib/editorStore';
import { buildMetaTags } from '../lib/meta';
import { exportElementAsPng } from '../lib/images';

jest.mock('../lib/images', () => ({
  exportElementAsPng: jest.fn().mockResolvedValue(undefined),
}));

describe('Toolbar shortcuts', () => {

  let logSpy: jest.SpyInstance;
  let writeText: jest.Mock;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
  });

  afterEach(() => {
    logSpy.mockRestore();
    writeText.mockReset();
  });

  it('handles undo via click and shortcut', () => {
    useEditorStore.getState().setTitle('initial');
    useEditorStore.getState().setTitle('changed');
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(useEditorStore.getState().title).toBe('initial');
    useEditorStore.getState().setTitle('changed');
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(useEditorStore.getState().title).toBe('initial');
  });

  it('handles redo via click and shortcut', () => {
    useEditorStore.getState().setTitle('initial');
    useEditorStore.getState().setTitle('changed');
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Redo' }));
    expect(useEditorStore.getState().title).toBe('changed');
    useEditorStore.getState().setTitle('initial');
    useEditorStore.getState().setTitle('changed');
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'Z', ctrlKey: true, shiftKey: true });
    expect(useEditorStore.getState().title).toBe('changed');
  });

  it('handles copy meta via click and shortcut', async () => {
    useEditorStore.getState().setTitle('My Title');
    useEditorStore.getState().setSubtitle('My Desc');
    render(<Toolbar />);
    const expected = buildMetaTags({ title: 'My Title', description: 'My Desc' });
    fireEvent.click(screen.getByRole('button', { name: 'Copy Meta' }));
    await waitFor(() =>
      expect((navigator.clipboard as any).writeText).toHaveBeenLastCalledWith(
        expected,
      ),
    );
    fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    await waitFor(() =>
      expect((navigator.clipboard as any).writeText).toHaveBeenLastCalledWith(
        expected,
      ),
    );
    expect(writeText).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it('handles save via click and shortcut', () => {
    render(<Toolbar />);
    expect(useEditorStore.getState().presets).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(useEditorStore.getState().presets).toHaveLength(1);
    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    expect(useEditorStore.getState().presets).toHaveLength(2);
  });

  it('exports image via click', async () => {
    const element = document.createElement('div');
    element.id = 'og-canvas';
    document.body.appendChild(element);
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    await waitFor(() => expect(exportElementAsPng).toHaveBeenCalled());
  });
});
