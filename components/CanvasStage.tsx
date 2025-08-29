"use client";

import Image from 'next/image';
import { useMemo, useEffect, useState } from 'react';
import { ensureSameOriginImage } from 'lib/urls';
import { useCanvasZoom } from 'lib/hooks/useCanvasZoom';
import { useLogoKeyboardControls } from 'lib/hooks/useLogoKeyboardControls';
import { useEditorStore } from 'lib/editorStore';
import useProcessedLogo from 'lib/hooks/useProcessedLogo';

import Draggable from './Draggable';
import CanvasToolbar from './CanvasToolbar';
import TransformHandles from './TransformHandles';

function hexToRgb(hex?: string): [number, number, number] | null {
  if (!hex) return null;
  const m = hex.replace('#', '').trim();
  const s = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(s, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]): number {
  const srgb = [r, g, b].map((v) => v / 255);
  const linear = srgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const la = luminance(a) + 0.05;
  const lb = luminance(b) + 0.05;
  return la > lb ? la / lb : lb / la;
}

function pickAccessibleTextColor(
  preferredHex: string | undefined,
  backgroundHex: string | undefined,
  fallback: `#${string}`
): string {
  const bg = hexToRgb(backgroundHex) ?? [255, 255, 255];
  if (preferredHex) {
    const pf = hexToRgb(preferredHex);
    if (pf && contrastRatio(pf, bg) >= 4.5) return preferredHex;
  }
  const black: [number, number, number] = [0, 0, 0];
  const white: [number, number, number] = [255, 255, 255];
  const useWhite = contrastRatio(white, bg) >= contrastRatio(black, bg);
  const chosen = useWhite ? '#ffffff' : '#111111';
  return chosen as string;
}

export default function CanvasStage() {
  const {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    titleFontFamily,
    subtitleFontFamily,
    titleFontWeight,
    subtitleFontWeight,
    titleBoxWidthPct,
    subtitleBoxWidthPct,
    titleColor,
    subtitleColor,
    titleLineHeight,
    subtitleLineHeight,
    titleLetterSpacing,
    subtitleLetterSpacing,
    titleAlign,
    subtitleAlign,
    titlePosition,
    subtitlePosition,
    theme,
    layout,
    vertical,
    accentColor,
    background,
    bannerUrl,
    logoFile,
    logoUrl,
    logoPosition,
    logoScale,
    logoRotation,
    logoFlipX,
    logoFlipY,
    titleRotation,
    subtitleRotation,
    setLogoPosition,
    setLogoScale,
    setTitlePosition,
    setSubtitlePosition,
    invertLogo,
    removeLogoBg,
    maskLogo,
    width,
    height,
    autoLayout,
    freezeSizeOnDrag,
    snapToGuides,
    setSelected,
    // extra setters for resize/rotate controls
    setTitleFontSize,
    setSubtitleFontSize,
    setTitleBoxWidthPct,
    setSubtitleBoxWidthPct,
    setTitleRotation,
    setSubtitleRotation,
    setLogoRotation,
    setAutoLayout,
    selected,
    resizingTitleBox,
    resizingSubtitleBox,
  } = useEditorStore();
  const { containerRef, zoom } = useCanvasZoom(width, height);
  const { logoDataUrl, loading: logoLoading, cancellable, cancel } = useProcessedLogo({
    logoFile,
    logoUrl,
    removeLogoBg,
    invertLogo,
  });
  const themeClasses = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const fallbackAlign = (al?: 'left' | 'center' | 'right') =>
    al ?? (layout === 'center' ? 'center' : layout === 'right' ? 'right' : 'left');
  const titleAlignCss = fallbackAlign(titleAlign);
  const subtitleAlignCss = fallbackAlign(subtitleAlign);
  // Auto layout: position elements based on layout/vertical when enabled
  useEffect(() => {
    if (!autoLayout) return;
    const xPos = layout === 'left' ? 25 : layout === 'right' ? 75 : 50;
    const yBase = theme === 'dark' ? 52 : 50; // tiny tweak for contrast
    const yPos = vertical === 'top' ? 30 : vertical === 'bottom' ? 70 : yBase;
    // Title slightly above, subtitle slightly below the baseline
    setTitlePosition(xPos, Math.max(5, yPos - 8));
    setSubtitlePosition(xPos, Math.min(95, yPos + 8));
    // Place logo opposite the text side and clamp to canvas considering scale
    const logoX = layout === 'left' ? 80 : layout === 'right' ? 20 : 85;
    const logoY = vertical === 'top' ? 80 : vertical === 'bottom' ? 20 : 85;
    const halfW = ((96 * logoScale) / width) * 50; // Image default 96px
    const halfH = ((96 * logoScale) / height) * 50;
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
    const cx = clamp(logoX, Math.min(halfW, 100 - halfW), Math.max(halfW, 100 - halfW));
    const cy = clamp(logoY, Math.min(halfH, 100 - halfH), Math.max(halfH, 100 - halfH));
    setLogoPosition(cx, cy);
  }, [autoLayout, layout, vertical, theme, logoScale, width, height, setTitlePosition, setSubtitlePosition, setLogoPosition]);

  const bannerSrc = useMemo(() => ensureSameOriginImage(bannerUrl), [bannerUrl]);

  const paddingTop = `${(height / width) * 100}%`;
  const { onKeyDown } = useLogoKeyboardControls({
    logoScale,
    logoPosition,
    setLogoScale,
    setLogoPosition,
  });

  // Alignment guides and accessible text colors
  // Guide lines: center, thirds, quarters, and 5% margins
  const GUIDE_RADIUS = 1.2; // in percent units
  const xGuides = useMemo(() => [5, 25, 33.333, 50, 66.667, 75, 95], []);
  const yGuides = useMemo(() => [5, 25, 33.333, 50, 66.667, 75, 95], []);
  const [dragTitle, setDragTitle] = useState(false);
  const [dragSubtitle, setDragSubtitle] = useState(false);
  const [dragLogo, setDragLogo] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const draggingAny = dragTitle || dragSubtitle || dragLogo;
  const positionsX = [titlePosition.x, subtitlePosition.x, logoPosition.x];
  const positionsY = [titlePosition.y, subtitlePosition.y, logoPosition.y];
  const nearXGuides = snapToGuides && draggingAny
    ? xGuides.filter((g) => positionsX.some((v) => Math.abs(v - g) <= GUIDE_RADIUS))
    : [];
  const nearYGuides = snapToGuides && draggingAny
    ? yGuides.filter((g) => positionsY.some((v) => Math.abs(v - g) <= GUIDE_RADIUS))
    : [];
  const computedTitleColor = pickAccessibleTextColor(titleColor ?? accentColor, background, '#111111');
  const computedSubtitleColor = pickAccessibleTextColor(subtitleColor, background, theme === 'dark' ? '#ffffff' : '#111111');


  // rotation/scale logic moved to TransformHandles

  // Auto-size fonts when resizing via inputs
  const [prevTitleWidthPx, setPrevTitleWidthPx] = useState<number | null>(null);
  const [prevSubtitleWidthPx, setPrevSubtitleWidthPx] = useState<number | null>(null);
  useEffect(() => {
    if (!resizingTitleBox) { setPrevTitleWidthPx(null); return; }
    const cur = ((titleBoxWidthPct ?? 60) / 100) * width;
    if (prevTitleWidthPx && prevTitleWidthPx > 0) {
      const ratio = cur / prevTitleWidthPx;
      const next = Math.max(6, Math.min(400, Math.round(titleFontSize * ratio)));
      if (next !== titleFontSize) setTitleFontSize(next);
    }
    setPrevTitleWidthPx(cur);
  }, [resizingTitleBox, titleBoxWidthPct, width]);
  useEffect(() => {
    if (!resizingSubtitleBox) { setPrevSubtitleWidthPx(null); return; }
    const cur = ((subtitleBoxWidthPct ?? 70) / 100) * width;
    if (prevSubtitleWidthPx && prevSubtitleWidthPx > 0) {
      const ratio = cur / prevSubtitleWidthPx;
      const next = Math.max(6, Math.min(400, Math.round(subtitleFontSize * ratio)));
      if (next !== subtitleFontSize) setSubtitleFontSize(next);
    }
    setPrevSubtitleWidthPx(cur);
  }, [resizingSubtitleBox, subtitleBoxWidthPct, width]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-0 overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
      style={{ paddingTop }}
      tabIndex={0}
      role="img"
      aria-label="OG image preview"
      onKeyDown={onKeyDown}
    >
      <CanvasToolbar />
      <div
        id="og-canvas"
        className={`absolute top-0 left-0 rounded-lg shadow-md border ${themeClasses}`}
        style={{
          width,
          height,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          borderColor: accentColor,
          backgroundColor: background
        }}
      >
        {(logoLoading || cancellable) && (
          <div className="absolute inset-0 z-20 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative mb-6 w-2/3 max-w-md rounded-md bg-white/90 p-3 shadow">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-800">
                <span>Removing background…</span>
                {cancellable && (
                  <button className="rounded border px-2 py-0.5 text-xs" onClick={cancel}>Cancel</button>
                )}
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                <div className="h-full w-1/3 animate-[progress_1.2s_ease-in-out_infinite] rounded bg-blue-500" />
              </div>
            </div>
            <style jsx>{`
              @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(50%); }
                100% { transform: translateX(200%); }
              }
            `}</style>
          </div>
        )}
        {bannerSrc && (
          <Image
            src={bannerSrc}
            alt="Banner image"
            fill
            className="absolute inset-0 w-full h-full object-cover"
            unoptimized // avoid double-optimization since we already proxy
          />
        )}
        {bannerSrc && <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-white/60'}`} />}
        {snapToGuides && draggingAny && (
          <>
            {nearXGuides.map((g) => (
              <div
                key={`vg-${g}`}
                className={`absolute top-0 h-full w-px transition-opacity`}
                style={{ left: `${g}%`, backgroundColor: accentColor, opacity: 0.7 }}
              />
            ))}
            {nearYGuides.map((g) => (
              <div
                key={`hg-${g}`}
                className={`absolute left-0 w-full h-px transition-opacity`}
                style={{ top: `${g}%`, backgroundColor: accentColor, opacity: 0.7 }}
              />
            ))}
          </>
        )}
        <Draggable
          position={titlePosition}
          onChange={setTitlePosition}
          rotateDeg={titleRotation ?? 0}
          zoom={zoom}
          baseWidth={width}
          baseHeight={height}
          freezeSizeOnDrag={!!freezeSizeOnDrag}
          snapToGuides={!!snapToGuides} snapRadiusPx={6}
          xGuides={xGuides}
          yGuides={yGuides}
          ignoreSnapModifier="Alt"
          onDraggingChange={setDragTitle}
          clampMode="center"
          disableDrag={transforming}
        >
          <div
            className={`relative ${resizingTitleBox ? 'outline outline-2 outline-dashed' : ''}`}
            style={{ width: `${((titleBoxWidthPct ?? 60) / 100) * width}px`, outlineColor: accentColor }}
          >
            <h1
              className={`break-words`}
              style={{
                color: computedTitleColor,
                fontFamily: titleFontFamily,
                fontWeight: titleFontWeight,
                fontSize: `${titleFontSize}px`,
                lineHeight: titleLineHeight,
                letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : undefined,
                textAlign: titleAlignCss as any,
              }}
              onPointerDown={() => setSelected('title')}
            >
              {title}
            </h1>
            <TransformHandles kind="title" zoom={zoom} canvasWidth={width} canvasHeight={height} onTransformingChange={setTransforming} />
          </div>
        </Draggable>
        <Draggable
          position={subtitlePosition}
          onChange={setSubtitlePosition}
          rotateDeg={subtitleRotation ?? 0}
          zoom={zoom}
          baseWidth={width}
          baseHeight={height}
          freezeSizeOnDrag={!!freezeSizeOnDrag}
          snapToGuides={!!snapToGuides} snapRadiusPx={6}
          xGuides={xGuides}
          yGuides={yGuides}
          ignoreSnapModifier="Alt"
          onDraggingChange={setDragSubtitle}
          clampMode="center"
          disableDrag={transforming}
        >
          <div
            className={`relative ${resizingSubtitleBox ? 'outline outline-2 outline-dashed' : ''}`}
            style={{ width: `${((subtitleBoxWidthPct ?? 70) / 100) * width}px`, outlineColor: accentColor }}
          >
            <p
              className={``}
              style={{
                color: computedSubtitleColor,
                fontFamily: subtitleFontFamily,
                fontWeight: subtitleFontWeight,
                fontSize: `${subtitleFontSize}px`,
                lineHeight: subtitleLineHeight,
                letterSpacing: subtitleLetterSpacing ? `${subtitleLetterSpacing}px` : undefined,
                textAlign: subtitleAlignCss as any,
              }}
              onPointerDown={() => setSelected('subtitle')}
            >
              {subtitle}
            </p>
            <TransformHandles kind="subtitle" zoom={zoom} canvasWidth={width} canvasHeight={height} onTransformingChange={setTransforming} />
          </div>
        </Draggable>
        {logoDataUrl && (
          <Draggable
            position={logoPosition}
            onChange={setLogoPosition}
            scale={logoScale}
            rotateDeg={logoRotation ?? 0}
            flipX={!!logoFlipX}
            flipY={!!logoFlipY}
            zoom={zoom}
            baseWidth={width}
            baseHeight={height}
            freezeSizeOnDrag={!!freezeSizeOnDrag}
            snapToGuides={!!snapToGuides} snapRadiusPx={6}
            xGuides={xGuides}
            yGuides={yGuides}
            ignoreSnapModifier="Alt"
            onDraggingChange={setDragLogo}
            disableDrag={transforming}
          >
            <Image
              src={logoDataUrl}
              alt="Logo"
              width={96}
              height={96}
              unoptimized
              className={`object-contain w-24 h-24 ${maskLogo ? 'rounded-full' : ''} shadow`}
              onPointerDown={() => setSelected('logo')}
            />
            <TransformHandles kind="logo" zoom={zoom} canvasWidth={width} canvasHeight={height} onTransformingChange={setTransforming} />
          </Draggable>
        )}
      </div>
    </div>
  );
}
