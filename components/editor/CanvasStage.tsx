
"use client";
import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from 'lib/editorStore';
import { invertImageColors, blobToDataURL } from 'lib/images';
import { removeImageBackground } from 'lib/removeBg';

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
  const base = { w: 1200, h: 630 };
  const {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    theme,
    layout,
    accentColor,
  } = useEditorStore();

  const {
    title,
    subtitle,
    theme,
    layout,
    accentColor,
    bannerUrl,
    logoFile,
    logoUrl,
    logoPosition,
    logoScale,
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

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === "dark" ? "#0b0c0f" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    ctx.font = `bold ${titleFontSize}px system-ui, -apple-system, Segoe UI, Roboto`;
    const titleX = layout === "center" ? canvas.width / 2 : 64;
    const subtitleX = titleX;
    ctx.textAlign = layout === "center" ? "center" : "left";
    ctx.fillText(title || "OGGenerator — Title", titleX, 180);
    ctx.font = `${subtitleFontSize}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillStyle = accentColor;
    ctx.fillText(subtitle || "Subtitle goes here", subtitleX, 240);
  };

  useEffect(() => {
    draw();
  }, [zoom, theme, layout, accentColor, title, subtitle, titleFontSize, subtitleFontSize]);
    
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
        console.error(e);
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

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        id="og-canvas"
        className={`relative rounded-lg shadow-md border ${themeClasses}`}
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          borderColor: accentColor
        }}
      >
        {/* Banner */}
        {bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerUrl}
            alt="Banner image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Overlay to darken/lighten banner for contrast */}
        {bannerUrl && <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-white/60'}`} />}
        {/* Content container */}
        <div
          className={`absolute inset-0 flex flex-col justify-center px-12 py-8 space-y-4 ${layoutClasses}`}
        >
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight break-words"
            style={{ color: accentColor }}
          >
            {title}
          </h1>
          <p className="text-lg md:text-2xl max-w-prose">
            {subtitle}
          </p>
        </div>
        {/* Logo overlay */}
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
