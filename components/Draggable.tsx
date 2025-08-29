"use client";

import { useState, useRef, type ReactNode } from 'react';

export const BASE_WIDTH = 1200;
export const BASE_HEIGHT = 630;

export default function Draggable({
  position,
  onChange,
  scale = 1,
  rotateDeg = 0,
  flipX = false,
  flipY = false,
  zoom,
  children,
  baseWidth = BASE_WIDTH,
  baseHeight = BASE_HEIGHT,
  freezeSizeOnDrag = false,
  snapToGuides = false,
  snapRadiusPx = 6,
  xGuides,
  yGuides,
  ignoreSnapModifier = 'Alt',
  onDraggingChange,
  clampMode = 'content',
  disableDrag = false,
}: {
  position: { x: number; y: number };
  onChange: (x: number, y: number, commit?: boolean) => void;
  scale?: number;
  rotateDeg?: number;
  flipX?: boolean;
  flipY?: boolean;
  zoom: number;
  children: ReactNode;
  baseWidth?: number;
  baseHeight?: number;
  freezeSizeOnDrag?: boolean;
  snapToGuides?: boolean;
  snapRadiusPx?: number;
  xGuides?: number[];
  yGuides?: number[];
  /** Hold this key to temporarily disable snapping */
  ignoreSnapModifier?: 'Alt' | 'Shift' | 'Control' | 'Meta';
  /** Notifies when dragging starts/ends */
  onDraggingChange?: (dragging: boolean) => void;
  /** Clamp strategy: 'content' keeps full box inside; 'center' keeps only center inside */
  clampMode?: 'content' | 'center';
  /** Disable drag entirely (e.g., when transforming via handles) */
  disableDrag?: boolean;
}) {
  const [start, setStart] = useState<
    | {
        pointer: { x: number; y: number };
        origin: { x: number; y: number };
      }
    | null
  >(null);
  // Element scale remains constant; previous edge-deformation logic removed
  const [frozenWidth, setFrozenWidth] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disableDrag) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    // Prefer measuring the child content box for accurate clamping
    const child = el.firstElementChild as HTMLElement | null;
    const measured = (child?.offsetWidth || el.offsetWidth);
    // Freeze current rendered width to avoid shrink-to-fit reflow while dragging
    setFrozenWidth(measured);
    setStart({
      pointer: { x: e.clientX, y: e.clientY },
      origin: { x: position.x, y: position.y },
    });
    last.current = { x: position.x, y: position.y };
    onChange(position.x, position.y, true);
    el.setPointerCapture?.(e.pointerId);
    onDraggingChange?.(true);
  };

  const last = useRef<{ x: number; y: number }>({ x: position.x, y: position.y });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start || disableDrag) return;
    const dx = e.clientX - start.pointer.x;
    const dy = e.clientY - start.pointer.y;
    const el = e.currentTarget as HTMLElement;
    const child = el.firstElementChild as HTMLElement | null;
    const width = ((child?.offsetWidth || el.offsetWidth) * scale);
    const height = ((child?.offsetHeight || el.offsetHeight) * scale);
    const halfWidthPct = (width / baseWidth) * 50;
    const halfHeightPct = (height / baseHeight) * 50;
    const nx = start.origin.x + (dx / (baseWidth * zoom)) * 100;
    const ny = start.origin.y + (dy / (baseHeight * zoom)) * 100;
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    // Clamp strategy
    let minX: number, maxX: number, minY: number, maxY: number;
    if (clampMode === 'center') {
      minX = 0; maxX = 100;
      minY = 0; maxY = 100;
    } else {
      // content mode: keep full box inside canvas
      minX = Math.min(halfWidthPct, 100 - halfWidthPct);
      maxX = Math.max(halfWidthPct, 100 - halfWidthPct);
      minY = Math.min(halfHeightPct, 100 - halfHeightPct);
      maxY = Math.max(halfHeightPct, 100 - halfHeightPct);
    }

    let x = clamp(nx, minX, maxX);
    let y = clamp(ny, minY, maxY);

    // Snapping to provided guides when enabled (hold modifier to ignore)
    if (snapToGuides && !(ignoreSnapModifier === 'Alt' && e.altKey) && !(ignoreSnapModifier === 'Shift' && e.shiftKey) && !(ignoreSnapModifier === 'Control' && e.ctrlKey) && !(ignoreSnapModifier === 'Meta' && e.metaKey)) {
      const radiusPct = Math.max(snapRadiusPx / baseWidth, snapRadiusPx / baseHeight) * 100;
      const snap = (v: number, targets: number[], radius = radiusPct) => {
        for (const t of targets) {
          if (Math.abs(v - t) <= radius) return t;
        }
        return v;
      };
      const xTargets = (xGuides && xGuides.length ? xGuides : [50]).slice().sort((a, b) => Math.abs(x - a) - Math.abs(x - b));
      const yTargets = (yGuides && yGuides.length ? yGuides : [50]).slice().sort((a, b) => Math.abs(y - a) - Math.abs(y - b));
      x = snap(x, xTargets);
      y = snap(y, yTargets);
    }

    last.current = { x, y };
    onChange(x, y, false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setStart(null);
    if (!freezeSizeOnDrag) setFrozenWidth(null);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    onDraggingChange?.(false);
  };
  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    setStart(null);
    if (!freezeSizeOnDrag) setFrozenWidth(null);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    onDraggingChange?.(false);
  };

  return (
    <div
      data-draggable="1"
      className={`absolute relative ${start ? 'outline outline-2 outline-blue-500' : ''}`}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        // Build transform: scale, translate to center, then optional rotate/flip
        transform: [
          `scale(${scale})`,
          'translate(-50%, -50%)',
          rotateDeg ? `rotate(${rotateDeg}deg)` : '',
          flipX ? 'scaleX(-1)' : '',
          flipY ? 'scaleY(-1)' : '',
        ]
          .filter(Boolean)
          .join(' '),
        transformOrigin: 'center center',
        width: frozenWidth != null ? `${frozenWidth}px` : undefined,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {children}
    </div>
  );
}

