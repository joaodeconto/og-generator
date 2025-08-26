import { render, fireEvent, screen } from '@testing-library/react';
import CanvasStage from '../components/CanvasStage';
import { useEditorStore } from '../lib/editorStore';

describe('CanvasStage drag', () => {
  beforeAll(() => {
    // jsdom lacks PointerEvent; map to MouseEvent for tests
    (window as any).PointerEvent = MouseEvent;
  });
  beforeEach(() => {
    useEditorStore.getState().reset();
    useEditorStore.setState({
      logoUrl: 'https://example.com/logo.png',
      logoPosition: { x: 50, y: 50 },
      logoScale: 1,
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
    Object.defineProperty(wrapper, 'getBoundingClientRect', {
      value: () => ({
        width: 96,
        height: 96,
        top: 0,
        left: 0,
        bottom: 96,
        right: 96,
        toJSON: () => {},
      }),
    });

    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: -1000, clientY: -1000 });
    let pos = useEditorStore.getState().logoPosition;
    expect(pos.x).toBeCloseTo(4, 1);
    expect(pos.y).toBeCloseTo(7.6, 1);
    fireEvent.pointerMove(wrapper, { clientX: 2000, clientY: 2000 });
    pos = useEditorStore.getState().logoPosition;
    expect(pos.x).toBeCloseTo(96, 1);
    expect(pos.y).toBeCloseTo(92.4, 1);
    fireEvent.pointerUp(wrapper, { clientX: 2000, clientY: 2000 });
  });
});
