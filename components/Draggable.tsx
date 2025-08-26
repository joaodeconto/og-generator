"use client";

import { useState, useRef, type ReactNode } from 'react';

export const BASE_WIDTH = 1200;
export const BASE_HEIGHT = 630;

export default function Draggable({
  position,
  onChange,
  scale = 1,
  zoom,
  children,
  baseWidth = BASE_WIDTH,
  baseHeight = BASE_HEIGHT,
}: {
  position: { x: number; y: number };
  onChange: (x: number, y: number, commit?: boolean) => void;
  scale?: number;
  zoom: number;
  children: ReactNode;
  baseWidth?: number;
  baseHeight?: number;
}) {
  const [start, setStart] = useState<
    | {
        pointer: { x: number; y: number };
        origin: { x: number; y: number };
      }
    | null
  >(null);
  // Element scale remains constant; previous edge-deformation logic removed

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStart({
      pointer: { x: e.clientX, y: e.clientY },
      origin: { x: position.x, y: position.y },
    });
    last.current = { x: position.x, y: position.y };
    onChange(position.x, position.y, true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const last = useRef<{ x: number; y: number }>({ x: position.x, y: position.y });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start) return;
    const dx = e.clientX - start.pointer.x;
    const dy = e.clientY - start.pointer.y;
    const el = e.currentTarget as HTMLElement;
    const width = el.offsetWidth * scale;
    const height = el.offsetHeight * scale;
    const halfWidthPct = (width / baseWidth) * 50;
    const halfHeightPct = (height / baseHeight) * 50;
    const nx = start.origin.x + (dx / (baseWidth * zoom)) * 100;
    const ny = start.origin.y + (dy / (baseHeight * zoom)) * 100;
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);
    const x = clamp(nx, Math.min(halfWidthPct, 100 - halfWidthPct), Math.max(halfWidthPct, 100 - halfWidthPct));
    const y = clamp(ny, Math.min(halfHeightPct, 100 - halfHeightPct), Math.max(halfHeightPct, 100 - halfHeightPct));

    last.current = { x, y };
    onChange(x, y, false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setStart(null);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className={`absolute ${start ? 'outline outline-2 outline-blue-500' : ''}`}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </div>
  );
}

