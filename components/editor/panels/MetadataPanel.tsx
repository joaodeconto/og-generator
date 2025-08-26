"use client";

import { useState } from 'react';
import { useMetadataStore } from 'lib/metadataStore';
import { useEditorStore } from 'lib/editorStore';
import { toast } from 'components/ToastProvider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

/**
 * Panel for editing metadata related to the current Open Graph image. By
 * separating these fields from the main editor store we maintain a modular
 * architecture where metadata can evolve independently from visual settings.
 */
export default function MetadataPanel() {
  const [url, setUrl] = useState('');
  const {
    description,
    image,
    favicon,
    siteName,
    warnings,
    setDescription,
    setImage,
    setFavicon,
    setSiteName,
    setWarnings
  } = useMetadataStore();
  const { setTitle, setSubtitle, setBannerUrl, setLogoUrl } = useEditorStore();

  async function handleFetch() {
    if (!url) return;
    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to fetch metadata' }));
        const message = data.error || 'Failed to fetch metadata';
        setWarnings([message]);
        toast({ message, variant: 'error' });
        return;
      }
      const data = await res.json();
      setSiteName(data.title || '');
      setDescription(data.description || '');
      setImage(data.image || '');
      setFavicon(data.favicon || '');
      setWarnings(data.warnings || []);
      // Populate canvas editor with scraped metadata
      setTitle(data.title || '');
      setSubtitle(data.description || '');
      setBannerUrl(data.image || undefined);
      setLogoUrl(data.favicon || undefined);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch metadata';
      setWarnings([message]);
      toast({ message, variant: 'error' });
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Metadata</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="url">
          URL
        </label>
        <div className="mt-1 flex gap-2">
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com"
          />
          <Button type="button" onClick={handleFetch}>
            Fetch metadata
          </Button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="siteName">
          Nome do site
        </label>
        <Input
          id="siteName"
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          placeholder="Nome do site"
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
          Descrição
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da página"
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="image">
          URL da imagem
        </label>
        <Input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://exemplo.com/imagem.png"
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="favicon">
          URL do favicon
        </label>
        <Input
          id="favicon"
          type="url"
          value={favicon}
          onChange={(e) => setFavicon(e.target.value)}
          placeholder="https://exemplo.com/favicon.ico"
          className="mt-1"
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
