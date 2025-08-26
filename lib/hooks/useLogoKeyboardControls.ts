import { useCallback } from 'react';

interface LogoKeyboardControls {
  logoScale: number;
  logoPosition: { x: number; y: number };
  setLogoScale: (scale: number) => void;
  setLogoPosition: (x: number, y: number, commit?: boolean) => void;
}

export function useLogoKeyboardControls({
  logoScale,
  logoPosition,
  setLogoScale,
  setLogoPosition,
}: LogoKeyboardControls) {
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          const delta = e.key === 'ArrowUp' ? 0.05 : -0.05;
          const next = Math.min(3, Math.max(0.2, logoScale + delta));
          setLogoScale(next);
        } else {
          const dx = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
          const dy = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
          setLogoPosition(logoPosition.x + dx, logoPosition.y + dy);
        }
      }
    },
    [logoScale, logoPosition, setLogoScale, setLogoPosition]
  );

  return { onKeyDown };
}

export default useLogoKeyboardControls;
