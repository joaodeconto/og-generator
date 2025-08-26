import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Draggable from '../components/Draggable';

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

  const getScale = (el: HTMLElement) => {
    const match = el.style.transform.match(/scale\(([^)]+)\)/);
    return match ? parseFloat(match[1]) : 1;
  };

  it('deforms near edges and restores after release', async () => {
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
    fireEvent.pointerMove(wrapper, { clientX: -1000, clientY: 50 });

    await waitFor(() => {
      expect(getScale(wrapper)).toBeLessThan(1);
    });

    fireEvent.pointerUp(wrapper, { clientX: -1000, clientY: 50 });

    await waitFor(() => {
      expect(getScale(wrapper)).toBeCloseTo(1);
    });
  });
});

