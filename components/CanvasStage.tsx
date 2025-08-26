
"use client";

import Image from 'next/image';
import { useMemo } from 'react';
import { ensureSameOriginImage } from 'lib/urls';
import { useCanvasZoom } from 'lib/hooks/useCanvasZoom';
import { useLogoKeyboardControls } from 'lib/hooks/useLogoKeyboardControls';
import { useEditorStore } from 'lib/editorStore';
import useProcessedLogo from 'lib/hooks/useProcessedLogo';

import Draggable from './Draggable';

export default function CanvasStage() {
  const {
    title,
    subtitle,
    titleFontSize,
    titlePosition,
    subtitlePosition,
    theme,
    layout,
    accentColor,
    background,
    bannerUrl,
    logoFile,
    logoUrl,
    logoPosition,
    logoScale,
    setLogoPosition,
    setLogoScale,
    setTitlePosition,
    setSubtitlePosition,
    invertLogo,
    removeLogoBg,
    maskLogo,
    width,
    height,
  } = useEditorStore();
  const { containerRef, zoom } = useCanvasZoom(width, height);
  const { logoDataUrl } = useProcessedLogo({
    logoFile,
    logoUrl,
    removeLogoBg,
    invertLogo,
  });
  const themeClasses = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textAlignClass =
    layout === 'center'
      ? 'text-center'
      : layout === 'right'
        ? 'text-right'
        : 'text-left';

  const { onKeyDown } = useLogoKeyboardControls({
    logoScale,
    logoPosition,
    setLogoScale,
    setLogoPosition,
  });


  const bannerSrc = useMemo(() => ensureSameOriginImage(bannerUrl), [bannerUrl]);

  const paddingTop = `${(height / width) * 100}%`;

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
        <Draggable
          position={titlePosition}
          onChange={setTitlePosition}
          zoom={zoom}
          baseWidth={width}
          baseHeight={height}
        >
          <h1
            className={`font-bold leading-tight break-words ${textAlignClass}`}
            style={{ color: accentColor, fontSize: `${titleFontSize}px` }}
          >
            {title}
          </h1>
        </Draggable>
        <Draggable
          position={subtitlePosition}
          onChange={setSubtitlePosition}
          zoom={zoom}
          baseWidth={width}
          baseHeight={height}
        >
          <p className={`text-lg md:text-2xl max-w-prose ${textAlignClass}`}>
            {subtitle}
          </p>
        </Draggable>
        {logoDataUrl && (
          <Draggable
            position={logoPosition}
            onChange={setLogoPosition}
            scale={logoScale}
            zoom={zoom}
            baseWidth={width}
            baseHeight={height}
          >
            <Image
              src={logoDataUrl}
              alt="Logo"
              width={96}
              height={96}
              unoptimized
              className={`object-contain w-24 h-24 ${maskLogo ? 'rounded-full' : ''} shadow`}
            />
          </Draggable>
        )}
      </div>
    </div>
  );
}
