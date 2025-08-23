"use client";

import Image from 'next/image';
import { useEditorStore } from 'lib/editorStore';
import { useEffect, useState } from 'react';

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
    theme,
    layout,
    accentColor,
    bannerUrl,
    logoFile,
    logoPosition,
    logoScale,
    invertLogo
  } = useEditorStore();
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);

  // Convert uploaded logo file into data URL for display
  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(logoFile);
      return () => reader.abort();
    }
    setLogoDataUrl(undefined);
  }, [logoFile]);

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
        <Image
          src={bannerUrl}
          alt="Banner image"
          fill
          className="object-cover"
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
          {title || 'Seu título aqui'}
        </h1>
        <p className="text-lg md:text-2xl max-w-prose">
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
            transform: `translate(-50%, -50%) scale(${logoScale})`,
            filter: invertLogo ? 'invert(1)' : undefined
          }}
        >
          {/* We ignore type errors because Next.js <Image> requires fixed width/height or fill. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUrl}
            alt="Logo"
            className="object-contain w-24 h-24 rounded-full shadow"
          />
        </div>
      )}
    </div>
  );
}