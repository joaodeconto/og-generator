import { renderHook, act } from '@testing-library/react';
import { useLogoKeyboardControls } from '../lib/hooks/useLogoKeyboardControls';

describe('useLogoKeyboardControls', () => {
  it('updates position and scale on arrow keys', () => {
    const setLogoScale = jest.fn();
    const setLogoPosition = jest.fn();

    const { result } = renderHook(() =>
      useLogoKeyboardControls({
        logoScale: 1,
        logoPosition: { x: 50, y: 50 },
        setLogoScale,
        setLogoPosition,
      })
    );

    act(() => {
      result.current.onKeyDown({
        key: 'ArrowRight',
        preventDefault: jest.fn(),
      } as any);
    });
    expect(setLogoPosition).toHaveBeenCalledWith(51, 50);

    act(() => {
      result.current.onKeyDown({
        key: 'ArrowUp',
        shiftKey: true,
        preventDefault: jest.fn(),
      } as any);
    });
    expect(setLogoScale).toHaveBeenCalledWith(1.05);
  });
});
