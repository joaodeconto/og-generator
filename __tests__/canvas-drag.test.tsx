import { act, render, fireEvent, screen } from '@testing-library/react';
import CanvasStage from '../components/CanvasStage';
import { useEditorStore } from '../lib/editorStore';
import { BASE_WIDTH, BASE_HEIGHT } from '../components/Draggable';

describe('CanvasStage drag', () => {
  beforeAll(() => {
    // jsdom lacks PointerEvent; map to MouseEvent for tests
    (window as any).PointerEvent = MouseEvent;
  });
  beforeEach(() => {
    act(() => {
      useEditorStore.getState().reset();
      useEditorStore.setState({
        logoUrl: 'https://example.com/logo.png',
        logoPosition: { x: 50, y: 50 },
        logoScale: 1,
      });
    });
  });

  it('updates store as logo is dragged multiple times', () => {
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const wrapper = logo.parentElement as HTMLElement;

    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(wrapper, { clientX: 160, clientY: 130 });
    const first = useEditorStore.getState().logoPosition;
    fireEvent.pointerMove(wrapper, { clientX: 200, clientY: 160 });
    const second = useEditorStore.getState().logoPosition;
    fireEvent.pointerUp(wrapper, { clientX: 200, clientY: 160 });

    expect(first.x).toBeGreaterThan(50);
    expect(first.y).toBeGreaterThan(50);
    expect(second.x).toBeGreaterThan(first.x);
    expect(second.y).toBeGreaterThan(first.y);
  });

  it('clamps drag to keep the logo fully visible', () => {
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const wrapper = logo.parentElement as HTMLElement;
    Object.defineProperty(wrapper, 'offsetWidth', { value: 96 });
    Object.defineProperty(wrapper, 'offsetHeight', { value: 96 });

    const halfWidthPct = (96 / BASE_WIDTH) * 50;
    const halfHeightPct = (96 / BASE_HEIGHT) * 50;

    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: -1000, clientY: -1000 });
    let pos = useEditorStore.getState().logoPosition;
    expect(pos.x).toBeCloseTo(halfWidthPct, 1);
    expect(pos.y).toBeCloseTo(halfHeightPct, 1);
    fireEvent.pointerMove(wrapper, { clientX: 2000, clientY: 2000 });
    pos = useEditorStore.getState().logoPosition;
    expect(pos.x).toBeCloseTo(100 - halfWidthPct, 1);
    expect(pos.y).toBeCloseTo(100 - halfHeightPct, 1);
    fireEvent.pointerUp(wrapper, { clientX: 2000, clientY: 2000 });
  });

  it('saves a single history entry on drag release', () => {
    render(<CanvasStage />);
    const logo = screen.getByAltText('Logo');
    const wrapper = logo.parentElement as HTMLElement;

    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(wrapper, { clientX: 160, clientY: 130 });
    fireEvent.pointerMove(wrapper, { clientX: 200, clientY: 160 });
    fireEvent.pointerUp(wrapper, { clientX: 200, clientY: 160 });

    const afterDrag = useEditorStore.getState().logoPosition;
    expect(afterDrag.x).toBeGreaterThan(50);

    act(() => {
      useEditorStore.getState().undo();
    });
    const undone = useEditorStore.getState().logoPosition;
    expect(undone).toEqual({ x: 50, y: 50 });
  });
});
