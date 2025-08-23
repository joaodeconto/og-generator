"use client";

import { useEditorStore } from 'lib/editorStore';
import { useSession } from 'next-auth/react';

/**
 * Buttons to export the generated Open Graph image and copy the associated
 * meta tags. Currently only meta tag copying is implemented. The PNG export
 * is left as a TODO for future sprints.
 */
export default function ExportControls() {
  const { title, subtitle } = useEditorStore();
  const { data: session } = useSession();

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
    alert('Funcionalidade “Surpreenda-me” não implementada ainda.');
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
    </div>
  );
}