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

    expect(onChange).toHaveBeenCalledTimes(2);
    const first = onChange.mock.calls[0] as [number, number, boolean];
    const second = onChange.mock.calls[1] as [number, number, boolean];
    expect(first[2]).toBe(true);
    expect(second[2]).toBe(false);
    expect(second[0]).not.toBe(50);
    expect(second[1]).not.toBe(50);
  });

  it('applies scale before translation', () => {
    render(
      <Draggable position={{ x: 50, y: 50 }} onChange={() => {}} zoom={1} scale={2}>
        <div data-testid="content" />
      </Draggable>
    );
    const wrapper = screen.getByTestId('content').parentElement as HTMLElement;
    expect(wrapper).toHaveStyle('transform: scale(2) translate(-50%, -50%)');
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

    const halfWidthPct = (96 / BASE_WIDTH) * 50;
    const halfHeightPct = (96 / BASE_HEIGHT) * 50;

    // Left edge
    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: -1000, clientY: 50 });
    let [x, y] = onChange.mock.calls.at(-1) as [number, number];
    expect(x).toBeCloseTo(halfWidthPct);
    fireEvent.pointerUp(wrapper, { clientX: -1000, clientY: 50 });

    // Right edge
    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: 5000, clientY: 50 });
    [x, y] = onChange.mock.calls.at(-1) as [number, number];
    expect(x).toBeCloseTo(100 - halfWidthPct);
    fireEvent.pointerUp(wrapper, { clientX: 5000, clientY: 50 });

    // Top edge
    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: 50, clientY: -1000 });
    [x, y] = onChange.mock.calls.at(-1) as [number, number];
    expect(y).toBeCloseTo(halfHeightPct);
    fireEvent.pointerUp(wrapper, { clientX: 50, clientY: -1000 });

    // Bottom edge
    fireEvent.pointerDown(wrapper, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(wrapper, { clientX: 50, clientY: 5000 });
    [x, y] = onChange.mock.calls.at(-1) as [number, number];
    expect(y).toBeCloseTo(100 - halfHeightPct);
    fireEvent.pointerUp(wrapper, { clientX: 50, clientY: 5000 });
  });
});

