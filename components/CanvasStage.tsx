"use client";

import { useEditorStore } from 'lib/editorStore';
import { useEffect, useState } from 'react';
import { invertImageColors, blobToDataURL } from 'lib/images';
import { removeImageBackground } from 'lib/removeBg';
import { toast } from './ToastProvider';

/**
 * A simple visual representation of the generated Open Graph image. This
 * component is intentionally basic: it lays out the title, subtitle and
 * uploaded logo on top of an optional banner. When used in combination with
 * EditorControls it allows the user to configure the look of their OG image.
 */
export default function CanvasStage() {
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
    invertLogo,
    removeLogoBg,
    maskLogo
  } = useEditorStore();
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);

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

  // Determine CSS classes for themes and layout
  const themeClasses = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const layoutClasses = layout === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div
      id="og-canvas"
      className={`relative w-full h-0 pt-[52.5%] overflow-hidden rounded-lg shadow-md border ${themeClasses}`}
      style={{ borderColor: accentColor }}
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
          className="font-bold leading-tight break-words"
          style={{ color: accentColor, fontSize: `${titleFontSize}px` }}
        >
          {title || 'Seu título aqui'}
        </h1>
        <p className="max-w-prose" style={{ fontSize: `${subtitleFontSize}px` }}>
          {subtitle || 'Subtítulo ou descrição aqui'}
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
          {/* We ignore type errors because Next.js <Image> requires fixed width/height or fill. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUrl}
            alt="Logo"
            className={`object-contain w-24 h-24 ${maskLogo ? 'rounded-full' : ''} shadow`}
          />
        </div>
      )}
    </div>
  );
}
