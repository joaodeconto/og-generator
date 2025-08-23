"use client";

import { useMetadataStore } from 'lib/metadataStore';

/**
 * Panel for editing metadata related to the current Open Graph image. By
 * separating these fields from the main editor store we maintain a modular
 * architecture where metadata can evolve independently from visual settings.
 */
export default function MetadataPanel() {
  const {
    description,
    image,
    favicon,
    siteName,
    warnings,
    setDescription,
    setImage,
    setFavicon,
    setSiteName
  } = useMetadataStore();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Metadata</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="siteName">
          Nome do site
        </label>
        <input
          id="siteName"
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Nome do site"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Descrição da página"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="image">
          URL da imagem
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://exemplo.com/imagem.png"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="favicon">
          URL do favicon
        </label>
        <input
          id="favicon"
          type="url"
          value={favicon}
          onChange={(e) => setFavicon(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://exemplo.com/favicon.ico"
        />
      </div>
      {warnings.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-yellow-600">
          {warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
