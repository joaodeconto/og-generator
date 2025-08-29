import { render, fireEvent, screen } from '@testing-library/react';
import Draggable from '../components/Draggable';

describe('Draggable freeze size options', () => {
  beforeAll(() => {
    (window as any).PointerEvent = MouseEvent;
  });

  it('keeps width after release when freezeSizeOnDrag is true', () => {
    render(
      <Draggable position={{ x: 50, y: 50 }} onChange={() => {}} zoom={1} freezeSizeOnDrag>
        <div data-testid="content" style={{ width: 140 }} />
      </Draggable>
    );
    const wrapper = screen.getByTestId('content').parentElement as HTMLElement;
    Object.defineProperty(wrapper, 'offsetWidth', { value: 140 });
    expect(wrapper.style.width).toBe('');
    fireEvent.pointerDown(wrapper, { clientX: 0, clientY: 0 });
    expect(wrapper.style.width).toBe('140px');
    fireEvent.pointerUp(wrapper, { clientX: 0, clientY: 0 });
    // Should persist since freezeSizeOnDrag=true
    expect(wrapper.style.width).toBe('140px');
  });

  it('clears width on pointer cancel when not frozen', () => {
    render(
      <Draggable position={{ x: 50, y: 50 }} onChange={() => {}} zoom={1}>
        <div data-testid="content" style={{ width: 100 }} />
      </Draggable>
    );
    const wrapper = screen.getByTestId('content').parentElement as HTMLElement;
    Object.defineProperty(wrapper, 'offsetWidth', { value: 100 });
    fireEvent.pointerDown(wrapper, { clientX: 0, clientY: 0 });
    expect(wrapper.style.width).toBe('100px');
    fireEvent.pointerCancel(wrapper);
    expect(wrapper.style.width).toBe('');
  });

  it('ignores moves when not dragging', () => {
    const onChange = jest.fn();
    render(
      <Draggable position={{ x: 50, y: 50 }} onChange={onChange} zoom={1}>
        <div data-testid="content" />
      </Draggable>
    );
    const wrapper = screen.getByTestId('content').parentElement as HTMLElement;
    // No pointerDown beforehand
    fireEvent.pointerMove(wrapper, { clientX: 10, clientY: 10 });
    expect(onChange).not.toHaveBeenCalled();
  });
});
