"use client";

import { useEditorStore } from 'lib/editorStore';
import { useState } from 'react';
import { exportElementAsPng, ImageSize } from 'lib/images';

/**
 * Buttons to export the generated Open Graph image and copy the associated
 * meta tags. Allows downloading the canvas as a PNG in different resolutions.
 */
export default function ExportControls() {
  const { title, subtitle } = useEditorStore();

  const sizePresets: Record<string, ImageSize> = {
    '1200x630': { width: 1200, height: 630 },
    '1600x900': { width: 1600, height: 900 },
    '1920x1005': { width: 1920, height: 1005 }
  };

  const [selectedSize, setSelectedSize] = useState<keyof typeof sizePresets>('1200x630');

  const handleCopyMeta = async () => {
    const tags = [
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${subtitle}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta name="twitter:card" content="summary_large_image" />`
    ].join('\n');
    try {
      await navigator.clipboard.writeText(tags);
      alert('Tags OG copiadas para a área de transferência!');
    } catch (err) {
      console.error(err);
      alert('Falha ao copiar as tags OG.');
    }
  };

  const handleExport = async () => {
    const element = document.getElementById('og-canvas');
    if (!element) {
      alert('Não foi possível encontrar o canvas para exportação.');
      return;
    }
    try {
      const size = sizePresets[selectedSize];
      await exportElementAsPng(element, size, `og-image-${selectedSize}.png`);
    } catch (err) {
      console.error(err);
      alert('Falha ao exportar a imagem.');
    }
  };

  const handleSurprise = () => {
    alert('Funcionalidade “Surpreenda-me” não implementada ainda.');
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
    </div>
  );
}