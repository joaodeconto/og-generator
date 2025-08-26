
"use client";

import Image from 'next/image';
//import { useMemo } from 'react';
//import { ensureSameOriginImage } from 'lib/urls';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useEditorStore } from 'lib/editorStore';
import { invertImageColors, blobToDataURL } from 'lib/images';
import { removeImageBackground } from 'lib/removeBg';
import { toast } from './ToastProvider';

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 630;

export default function CanvasStage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const {
    title,
    subtitle,
    titleFontSize,
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
    maskLogo,
    vertical
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
  const layoutClasses =
    layout === 'center'
      ? 'items-center text-center'
      : layout === 'right'
        ? 'items-end text-right'
        : 'items-start text-left';
  const verticalClasses =
    vertical === 'top'
      ? 'justify-start'
      : vertical === 'bottom'
        ? 'justify-end'
        : 'justify-center';

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

  function Draggable({
    position,
    onChange,
    scale = 1,
    children,
  }: {
    position: { x: number; y: number };
    onChange: (x: number, y: number) => void;
    scale?: number;
    children: ReactNode;
  }) {
    const [start, setStart] = useState<
      | {
        pointer: { x: number; y: number };
        origin: { x: number; y: number };
      }
      | null
    >(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setStart({
        pointer: { x: e.clientX, y: e.clientY },
        origin: { x: position.x, y: position.y },
      });
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!start) return;
      const dx = e.clientX - start.pointer.x;
      const dy = e.clientY - start.pointer.y;
      const x = Math.min(
        100,
        Math.max(0, start.origin.x + (dx / (BASE_WIDTH * zoom)) * 100),
      );
      const y = Math.min(
        100,
        Math.max(0, start.origin.y + (dy / (BASE_HEIGHT * zoom)) * 100),
      );
      onChange(x, y);
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

  const [resolvedBannerSrc, setResolvedBannerSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setResolvedBannerSrc(bannerUrl ? `/api/img?url=${encodeURIComponent(bannerUrl)}` : undefined);
  }, [bannerUrl]);

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
        {resolvedBannerSrc && (
          <Image
            src={resolvedBannerSrc}
            alt="Banner image"
            fill
            className="absolute inset-0 w-full h-full object-cover"
            unoptimized // avoid double-optimization since we already proxy
          />
        )}
        {resolvedBannerSrc && <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-white/60'}`} />}
        <div
          className={`absolute inset-0 flex flex-col ${verticalClasses} px-12 py-8 space-y-4 ${layoutClasses}`}
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
          <Draggable
            position={logoPosition}
            onChange={setLogoPosition}
            scale={logoScale}
          >
            <Image
              src={logoDataUrl}
              alt="Logo"
              width={96}
              height={96}
              crossOrigin="anonymous"
              className={`object-contain w-24 h-24 ${maskLogo ? 'rounded-full' : ''} shadow`}
            />
          </Draggable>
        )}
      </div>
    </div>
  );
}
