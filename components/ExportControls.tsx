"use client";

import { useEditorStore } from 'lib/editorStore';
import { useState } from 'react';
import { exportElementAsPng, ImageSize } from 'lib/images';
import { generateRandomStyle, type RandomStyle } from 'lib/randomStyle';
import { toast } from './ToastProvider';
import { buildMetaTags } from 'lib/meta';


/**
 * Buttons to export the generated Open Graph image and copy the associated
 * meta tags. Allows downloading the canvas as a PNG in different resolutions.
 */
export default function ExportControls() {

  const sizePresets: Record<string, ImageSize> = {
    '1200x630': { width: 1200, height: 630 },
    '1600x900': { width: 1600, height: 900 },
    '1920x1005': { width: 1920, height: 1005 }
  };

  const [selectedSize, setSelectedSize] = useState<keyof typeof sizePresets>('1200x630');
  const [selectedScale, setSelectedScale] = useState(1);
  const { title, subtitle, theme, layout, accentColor, setTheme, setLayout, setAccentColor } = useEditorStore();
  const [prevStyle, setPrevStyle] = useState<RandomStyle | null>(null);


  const handleCopyMeta = async () => {
    const tags = buildMetaTags({ title, description: subtitle });
    try {
      await navigator.clipboard.writeText(tags);
      toast({ message: 'Tags OG copiadas para a área de transferência!' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao copiar as tags OG.';
      toast({ message, variant: 'error' });
    }
  };

  const handleExport = async () => {
    const element = document.getElementById('og-canvas');
    if (!element) {
      toast({ message: 'Não foi possível encontrar o canvas para exportação.', variant: 'error' });
      return;
    }
    try {
      const size = sizePresets[selectedSize];
      await exportElementAsPng(
        element,
        size,
        `og-image-${selectedSize}@${selectedScale}x.png`,
        { pixelRatio: selectedScale }
      );
      toast({ message: 'Imagem exportada.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao exportar a imagem.';
      toast({ message, variant: 'error' });
    }
  };

  const handleSurprise = () => {
    setPrevStyle({ theme, layout, accentColor });
    const random = generateRandomStyle();
    setTheme(random.theme);
    setLayout(random.layout);
    setAccentColor(random.accentColor);
  };

  const handleUndo = () => {
    if (!prevStyle) return;
    setTheme(prevStyle.theme);
    setLayout(prevStyle.layout);
    setAccentColor(prevStyle.accentColor);
    setPrevStyle(null);
  };

  return (
    <div className="flex space-x-4">
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value as keyof typeof sizePresets)}
        className="rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
      >
        {Object.keys(sizePresets).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <select
        aria-label="resolução"
        value={selectedScale}
        onChange={(e) => setSelectedScale(Number(e.target.value))}
        className="rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
      >
        <option value={1}>@1x</option>
        <option value={2}>@2x</option>
      </select>
      <button
        onClick={handleExport}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Exportar PNG
      </button>
      <button
        onClick={handleCopyMeta}
        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        Copiar meta OG
      </button>
      <button
        onClick={handleSurprise}
        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
      >
        Surpreenda‑me
      </button>
      {prevStyle && (
        <button
          onClick={handleUndo}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
        >
          Desfazer
        </button>
      )}
    </div>
  );
}
