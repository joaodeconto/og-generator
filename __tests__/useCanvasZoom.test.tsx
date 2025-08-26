import React from 'react';
import { render } from '@testing-library/react';
import { useCanvasZoom } from '../lib/hooks/useCanvasZoom';

describe('useCanvasZoom', () => {
  it('disconnects observer on unmount', () => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    const Original = (global as any).ResizeObserver;
    (global as any).ResizeObserver = class {
      observe = observe;
      disconnect = disconnect;
    };

    function Test() {
      const { containerRef } = useCanvasZoom(1200, 630);
      return <div ref={containerRef} />;
    }

    const { unmount } = render(<Test />);
    expect(observe).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);

    (global as any).ResizeObserver = Original;
  });
});
