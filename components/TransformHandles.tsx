"use client";

import { useCallback } from 'react';
import { useEditorStore } from 'lib/editorStore';

type Kind = 'title' | 'subtitle' | 'logo';

export default function TransformHandles({
  kind,
  zoom,
  canvasWidth,
  canvasHeight,
  onTransformingChange,
}: {
  kind: Kind;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onTransformingChange?: (active: boolean) => void;
}) {
  const {
    selected,
    // positions / sizes
    titlePosition,
    subtitlePosition,
    logoPosition,
    titleFontSize,
    subtitleFontSize,
    titleBoxWidthPct,
    subtitleBoxWidthPct,
    logoScale,
    // setters
    setTitleRotation,
    setSubtitleRotation,
    setLogoRotation,
    setTitleBoxWidthPct,
    setSubtitleBoxWidthPct,
    setTitleFontSize,
    setSubtitleFontSize,
    setTitlePosition,
    setSubtitlePosition,
    setLogoScale,
    setLogoPosition,
    setAutoLayout,
  } = useEditorStore();

  const startRotate = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onTransformingChange?.(true);

    const btn = e.currentTarget as HTMLButtonElement;
    const host = (btn.closest('[data-draggable="1"]') as HTMLElement) ?? (btn.parentElement as HTMLElement);
    const canvas = document.getElementById('og-canvas') as HTMLElement | null;
    const canvasRect = canvas?.getBoundingClientRect();
    const pos = kind === 'title' ? titlePosition : kind === 'subtitle' ? subtitlePosition : logoPosition;
    const cx = canvasRect ? canvasRect.left + (pos.x / 100) * canvasWidth * zoom : (host.getBoundingClientRect().left + host.getBoundingClientRect().width / 2);
    const cy = canvasRect ? canvasRect.top + (pos.y / 100) * canvasHeight * zoom : (host.getBoundingClientRect().top + host.getBoundingClientRect().height / 2);
    const angleFromCenter = (px: number, py: number) => (Math.atan2(py - cy, px - cx) * 180) / Math.PI;
    const rotStart = kind === 'title' ? (useEditorStore.getState().titleRotation ?? 0) : kind === 'subtitle' ? (useEditorStore.getState().subtitleRotation ?? 0) : (useEditorStore.getState().logoRotation ?? 0);
    const a0 = angleFromCenter(e.clientX, e.clientY);
    const onMove = (ev: PointerEvent) => {
      const a1 = angleFromCenter(ev.clientX, ev.clientY);
      const delta = a1 - a0;
      const newDeg = rotStart + delta;
      if (kind === 'title') setTitleRotation(newDeg);
      else if (kind === 'subtitle') setSubtitleRotation(newDeg);
      else setLogoRotation(newDeg);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      onTransformingChange?.(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, [kind, zoom, canvasWidth, canvasHeight, setTitleRotation, setSubtitleRotation, setLogoRotation, titlePosition, subtitlePosition, logoPosition, onTransformingChange]);

  const startScale = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onTransformingChange?.(true);
    setAutoLayout(false);

    const btn = e.currentTarget as HTMLButtonElement;
    const host = (btn.closest('[data-draggable="1"]') as HTMLElement) ?? (btn.parentElement as HTMLElement);
    const rect = host.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const child = host.firstElementChild as HTMLElement | null;
    const childW = child?.offsetWidth || rect.width;
    const childH = child?.offsetHeight || rect.height;

    if (kind === 'logo') {
      const w0 = childW * logoScale;
      const h0 = childH * logoScale;
      const center0 = logoPosition;
      const topLeft0 = { x: center0.x - (w0 / canvasWidth) * 50, y: center0.y - (h0 / canvasHeight) * 50 };
      const scaleStart = logoScale;
      const ratioMax = Math.min(
        ((100 - topLeft0.x) / 100 * canvasWidth) / (w0 || 1),
        ((100 - topLeft0.y) / 100 * canvasHeight) / (h0 || 1)
      );
      const onMove = (ev: PointerEvent) => {
        const dx = (ev.clientX - startX) / (zoom || 1);
        const dy = (ev.clientY - startY) / (zoom || 1);
        const rx = (w0 + dx) / (w0 || 1);
        const ry = (h0 + dy) / (h0 || 1);
        let r = Math.max(rx, ry);
        if (!isFinite(r) || r <= 0) r = 0.1;
        r = Math.max(0.1, Math.min(r, ratioMax, 5 / (scaleStart || 1)));
        const newScale = scaleStart * r;
        const w2 = w0 * r;
        const h2 = h0 * r;
        const newCenter = {
          x: topLeft0.x + (w2 / canvasWidth) * 50,
          y: topLeft0.y + (h2 / canvasHeight) * 50,
        };
        const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
        setLogoScale(newScale);
        setLogoPosition(clamp(newCenter.x, 0, 100), clamp(newCenter.y, 0, 100), false);
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        onTransformingChange?.(false);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    } else {
      // Text: top-left anchor; update center based on new width/height
      const fs0 = kind === 'title' ? titleFontSize : subtitleFontSize;
      const center0 = kind === 'title' ? titlePosition : subtitlePosition;
      const w0 = childW;
      const h0 = childH;
      const topLeft0 = { x: center0.x - (w0 / canvasWidth) * 50, y: center0.y - (h0 / canvasHeight) * 50 };
      const onMove = (ev: PointerEvent) => {
        const dx = (ev.clientX - startX) / (zoom || 1);
        const dy = (ev.clientY - startY) / (zoom || 1);
        const rx = (w0 + dx) / (w0 || 1);
        const ry = (h0 + dy) / (h0 || 1);
        let r = Math.max(rx, ry);
        if (!isFinite(r) || r <= 0) r = 0.1;
        const w2 = Math.max(0.1 * canvasWidth, Math.min(canvasWidth, w0 * r));
        const newFs = Math.max(6, Math.min(400, Math.round(fs0 * (w2 / (w0 || 1)))));
        const h2 = Math.max(8, h0 * (w2 / (w0 || 1)));
        const pct = Math.round((w2 / canvasWidth) * 100);
        const newCenter = {
          x: topLeft0.x + (w2 / canvasWidth) * 50,
          y: topLeft0.y + (h2 / canvasHeight) * 50,
        };
        const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
        if (kind === 'title') {
          setTitleBoxWidthPct(pct);
          setTitleFontSize(newFs);
          setTitlePosition(clamp(newCenter.x, 0, 100), clamp(newCenter.y, 0, 100), false);
        } else {
          setSubtitleBoxWidthPct(pct);
          setSubtitleFontSize(newFs);
          setSubtitlePosition(clamp(newCenter.x, 0, 100), clamp(newCenter.y, 0, 100), false);
        }
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        onTransformingChange?.(false);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    }
  }, [kind, zoom, canvasWidth, canvasHeight, setAutoLayout, logoScale, logoPosition, titlePosition, subtitlePosition, titleFontSize, subtitleFontSize, setLogoScale, setLogoPosition, setTitleBoxWidthPct, setSubtitleBoxWidthPct, setTitleFontSize, setSubtitleFontSize, setTitlePosition, setSubtitlePosition, onTransformingChange]);

  if (selected !== kind) return null;

  return (
    <>
      <button
        aria-label={`Rotate ${kind}`}
        onPointerDown={startRotate}
        className="absolute -top-2 -left-2 h-5 w-5 rounded-full border bg-white/90 text-xs leading-4 shadow cursor-grab"
      >⤾</button>
      <button
        aria-label={`Scale ${kind}`}
        onPointerDown={startScale}
        className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full border bg-white/90 text-xs leading-4 shadow cursor-nwse-resize"
      >⤡</button>
    </>
  );
}

