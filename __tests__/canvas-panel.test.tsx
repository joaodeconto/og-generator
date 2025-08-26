import { render, screen, fireEvent } from '@testing-library/react';
import CanvasPanel from '../components/editor/panels/CanvasPanel';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasPanel background', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it('updates background color in the store', () => {
    render(<CanvasPanel />);
    const input = screen.getByLabelText('Background Color') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '#123456' } });
    expect(useEditorStore.getState().background).toBe('#123456');
  });
});
