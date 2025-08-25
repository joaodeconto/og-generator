
"use client";

import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from 'lib/editorStore';
import { invertImageColors, blobToDataURL } from 'lib/images';
import { removeImageBackground } from 'lib/removeBg';
import { toast } from './ToastProvider';

/**
 * CanvasStage used within the editor. It mirrors the rendering logic of the
 * public CanvasStage component while fitting the result inside the available
 * space via CSS scaling. Title, subtitle, banner and logo all derive from the
 * editor store.
 */
const BASE_WIDTH = 1200;
const BASE_HEIGHT = 630;

export default function CanvasStage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    theme,
    layout,
    accentColor,
    bannerUrl,
    logoFile,
    logoUrl,
    logoPosition,
    logoScale,
    setLogoPosition,
    setLogoScale,
    invertLogo,
    removeLogoBg,
    maskLogo
  } = useEditorStore();
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);

  // Resize observer to scale the canvas preview to fit its container
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = el;
      const scale = Math.min(clientWidth / BASE_WIDTH, clientHeight / BASE_HEIGHT);
      setZoom(scale * 0.98);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prepare logo image applying optional background removal and inversion
  useEffect(() => {
    let cancelled = false;
    const process = async () => {
      let source: string | Blob | undefined;
      if (logoFile) {
        source = logoFile;
      } else if (logoUrl) {
        source = logoUrl;
      } else {
        setLogoDataUrl(undefined);
        return;
      }

      try {
        if (removeLogoBg) {
          source = await removeImageBackground(source);
        } else if (source instanceof Blob) {
          source = await blobToDataURL(source);
        }

        if (invertLogo && typeof source === 'string') {
          source = await invertImageColors(source);
        }

        if (!cancelled) {
          setLogoDataUrl(source as string);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao processar a imagem.';
        toast({ message, variant: 'error' });
        if (!cancelled) {
          setLogoDataUrl(undefined);
        }
      }
    };
    process();
    return () => {
      cancelled = true;
    };
  }, [logoFile, logoUrl, removeLogoBg, invertLogo]);

  const themeClasses = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const layoutClasses = layout === 'center' ? 'items-center text-center' : 'items-start text-left';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-0 pt-[52.5%] overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
      tabIndex={0}
      role="img"
      aria-label="OG image preview"
      onKeyDown={handleKeyDown}
    >
      <div
        id="og-canvas"
        className={`absolute top-0 left-0 rounded-lg shadow-md border ${themeClasses}`}
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          borderColor: accentColor
        }}
      >
        {bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerUrl}
            alt="Banner image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {bannerUrl && <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-white/60'}`} />}
        <div
          className={`absolute inset-0 flex flex-col justify-center px-12 py-8 space-y-4 ${layoutClasses}`}
        >
          <h1
            className="font-bold leading-tight break-words"
            style={{ color: accentColor, fontSize: `${titleFontSize}px` }}
          >
            {title}
          </h1>
          <p className="text-lg md:text-2xl max-w-prose">
            {subtitle}
          </p>
        </div>
        {logoDataUrl && (
          <div
            className="absolute"
            style={{
              top: `${logoPosition.y}%`,
              left: `${logoPosition.x}%`,
              transform: `translate(-50%, -50%) scale(${logoScale})`
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUrl}
              alt="Logo"
              className={`object-contain w-24 h-24 ${maskLogo ? 'rounded-full' : ''} shadow`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
