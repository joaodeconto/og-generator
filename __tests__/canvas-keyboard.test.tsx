import { render, fireEvent, screen } from '@testing-library/react';
import CanvasStage from '../components/CanvasStage';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasStage keyboard controls', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
    useEditorStore.setState({ logoPosition: { x: 50, y: 50 }, logoScale: 1 });
  });

  it('moves logo with arrow keys and scales with Shift+Arrow', () => {
    render(<CanvasStage />);
    const stage = screen.getByRole('img', { name: 'OG image preview' });
    stage.focus();

    fireEvent.keyDown(stage, { key: 'ArrowRight' });
    expect(useEditorStore.getState().logoPosition.x).toBe(51);

    fireEvent.keyDown(stage, { key: 'ArrowUp', shiftKey: true });
    expect(useEditorStore.getState().logoScale).toBeCloseTo(1.05);
  });
});
