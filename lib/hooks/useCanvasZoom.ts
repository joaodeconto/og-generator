import { useEffect, useRef, useState } from 'react';

export function useCanvasZoom(baseWidth: number, baseHeight: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = el;
      const scale = Math.min(clientWidth / baseWidth, clientHeight / baseHeight);
      setZoom(scale * 0.98);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth, baseHeight]);

  return { zoom, containerRef };
}
