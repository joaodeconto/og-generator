import { render, fireEvent, screen } from '@testing-library/react';
import CanvasStage from '../components/CanvasStage';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasStage drag', () => {
  beforeAll(() => {
    // jsdom lacks PointerEvent; map to MouseEvent for tests
    (window as any).PointerEvent = MouseEvent;
  });
  beforeEach(() => {
    useEditorStore.setState({
      logoUrl: 'https://example.com/logo.png',
      logoPosition: { x: 50, y: 50 },
      logoScale: 1,
    });
  });

  it('updates store when logo is dragged', () => {
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const wrapper = logo.parentElement as HTMLElement;

    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(wrapper, { clientX: 160, clientY: 130 });
    fireEvent.pointerUp(wrapper, { clientX: 160, clientY: 130 });

    const { logoPosition } = useEditorStore.getState();
    expect(logoPosition.x).toBeGreaterThan(50);
    expect(logoPosition.y).toBeGreaterThan(50);
  });
});
