import { render, fireEvent, screen } from '@testing-library/react';
import Draggable, { BASE_WIDTH, BASE_HEIGHT } from '../components/Draggable';

describe('Draggable', () => {
  beforeAll(() => {
    // jsdom lacks PointerEvent; map to MouseEvent for tests
    (window as any).PointerEvent = MouseEvent;
  });

  it('calls onChange while dragging', () => {
    const onChange = jest.fn();
    render(
      <Draggable position={{ x: 50, y: 50 }} onChange={onChange} zoom={1}>
        <div data-testid="content" />
      </Draggable>
    );
    const wrapper = screen.getByTestId('content').parentElement as HTMLElement;
    Object.defineProperty(wrapper, 'offsetWidth', { value: 96 });
    Object.defineProperty(wrapper, 'offsetHeight', { value: 96 });

    fireEvent.pointerDown(wrapper, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(wrapper, { clientX: 160, clientY: 130 });
    fireEvent.pointerUp(wrapper, { clientX: 160, clientY: 130 });

    expect(onChange).toHaveBeenCalled();
    const [x, y] = onChange.mock.calls[0];
    expect(x).not.toBe(50);
    expect(y).not.toBe(50);
  });


  it('clamps position within canvas bounds', () => {
    const onChange = jest.fn();
    render(
      <Draggable position={{ x: 50, y: 50 }} onChange={onChange} zoom={1}>
        <div data-testid="content" />
      </Draggable>
    );
    const wrapper = screen.getByTestId('content').parentElement as HTMLElement;
    Object.defineProperty(wrapper, 'offsetWidth', { value: 96 });
    Object.defineProperty(wrapper, 'offsetHeight', { value: 96 });

    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });

    fireEvent.pointerMove(wrapper, { clientX: -1000, clientY: -1000 });
    const halfWidthPct = (96 / BASE_WIDTH) * 50;
    const halfHeightPct = (96 / BASE_HEIGHT) * 50;
    let [x, y] = onChange.mock.calls.at(-1) as [number, number];
    expect(x).toBeCloseTo(halfWidthPct);
    expect(y).toBeCloseTo(halfHeightPct);

    fireEvent.pointerUp(wrapper, { clientX: -1000, clientY: -1000 });

    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: 5000, clientY: 5000 });
    [x, y] = onChange.mock.calls.at(-1) as [number, number];
    expect(x).toBeCloseTo(100 - halfWidthPct);
    expect(y).toBeCloseTo(100 - halfHeightPct);
  });
});

