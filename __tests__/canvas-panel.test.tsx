import { render, screen, fireEvent } from '@testing-library/react';
import CanvasPanel from '../components/editor/panels/CanvasPanel';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasPanel', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it('changes canvas size via presets', () => {
    render(<CanvasPanel />);
    fireEvent.click(screen.getByRole('button', { name: /1600 by 900/i }));
    expect(useEditorStore.getState().width).toBe(1600);
    expect(useEditorStore.getState().height).toBe(900);
  });
});
