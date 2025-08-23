"use client";

import { useEditorStore } from 'lib/editorStore';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { generateRandomStyle, type RandomStyle } from 'lib/randomStyle';

/**
 * Buttons to export the generated Open Graph image and copy the associated
 * meta tags. Currently only meta tag copying is implemented. The PNG export
 * is left as a TODO for future sprints.
 */
export default function ExportControls() {
  const { title, subtitle, theme, layout, accentColor, setTheme, setLayout, setAccentColor } = useEditorStore();
  const { data: session } = useSession();
  const [prevStyle, setPrevStyle] = useState<RandomStyle | null>(null);

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

  const handleExport = () => {
    alert(
      'Exportação de PNG não implementada neste esqueleto. Implemente usando html-to-image ou um serviço de renderização em worker.'
    );
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