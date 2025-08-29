"use client";

import { useEffect, useMemo, useState } from 'react';
import { useEditorStore, deserializeEditorState, serializeEditorState, type EditorData } from 'lib/editorStore';
import { generateRandomPreset } from 'lib/randomStyle';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ToastProvider';
import { templatePresets } from 'lib/randomStyle';

/**
 * Panel for presets plus first-run helpers: quick URL import and save/load designs.
 */
export default function PresetsPanel() {
  const { presets, addPreset, applyPreset } = useEditorStore();
  type Saved = { id: string; name: string; updatedAt: number };
  const [designs, setDesigns] = useState<Saved[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadLocal = useMemo(() => () => {
    try {
      const raw = localStorage.getItem('saved-designs');
      setDesigns(raw ? (JSON.parse(raw) as Saved[]) : []);
    } catch {
      setDesigns([]);
    }
  }, []);
  const persistLocal = (next: Saved[]) => {
    setDesigns(next);
    localStorage.setItem('saved-designs', JSON.stringify(next));
  };
  useEffect(() => {
    loadLocal();
    try {
      const fav = localStorage.getItem('favorite-templates');
      setFavorites(fav ? (JSON.parse(fav) as string[]) : []);
    } catch {}
  }, [loadLocal]);
  const persistFavs = (ids: string[]) => {
    setFavorites(ids);
    localStorage.setItem('favorite-templates', JSON.stringify(ids));
  };

  const handleGeneratePreset = () => {
    const preset = generateRandomPreset();
    addPreset(preset);
    applyPreset(preset);
  };

  const handleSaveDesign = async () => {
    try {
      const state = useEditorStore.getState();
      const payload: EditorData = JSON.parse(serializeEditorState(state));
      const res = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save design');
      const { id } = await res.json();
      const entry: Saved = { id, name: state.title || 'Untitled', updatedAt: Date.now() };
      const next = [entry, ...designs.filter((d) => d.id !== id)].slice(0, 20);
      persistLocal(next);
      toast({ message: 'Design saved' });
    } catch (e) {
      toast({ message: e instanceof Error ? e.message : 'Failed to save', variant: 'error' });
    }
  };

  const handleLoadDesign = async (id: string) => {
    try {
      const res = await fetch(`/api/design?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Design not found');
      useEditorStore.getState().loadDesign(deserializeEditorState(JSON.stringify(data as EditorData)));
      toast({ message: 'Design loaded' });
    } catch (e) {
      toast({ message: e instanceof Error ? e.message : 'Failed to load', variant: 'error' });
    }
  };

  const handleDeleteDesign = (id: string) => {
    const next = designs.filter((d) => d.id !== id);
    persistLocal(next);
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [id, ...favorites];
    persistFavs(next);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Presets</h2>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {(templatePresets || []).map((tpl) => (
            <div key={tpl.id} className="flex items-center justify-between rounded border p-2">
              <button
                className="text-left text-sm"
                onClick={() => applyPreset(tpl.preset)}
                title={`${tpl.preset.theme} / ${tpl.preset.layout}`}
              >
                {tpl.name}
              </button>
              <button
                aria-label={`Favorite ${tpl.name}`}
                className={`text-xs ${favorites.includes(tpl.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavorite(tpl.id)}
                title={favorites.includes(tpl.id) ? 'Unfavorite' : 'Favorite'}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button aria-label="Gerar Preset Aleatório" onClick={handleGeneratePreset}>Gerar Preset Aleatório</Button>
        <Button variant="secondary" onClick={handleSaveDesign}>Save Design</Button>
      </div>
      <ul className="space-y-2">
        {presets.map((preset, index) => (
          <li key={index}>
            <Button
              onClick={() => applyPreset(preset)}
              variant="secondary"
              className="flex w-full items-center justify-between px-2 py-1 text-left"
            >
              <span className="text-sm">
                {preset.theme} / {preset.layout}
              </span>
              <span
                className="h-4 w-4 rounded"
                style={{ backgroundColor: preset.accentColor }}
              />
            </Button>
          </li>
        ))}
        {presets.length === 0 && (
          <li className="text-sm text-gray-500">No presets saved.</li>
        )}
      </ul>
      <div className="pt-2">
        <h3 className="text-sm font-semibold">Saved designs</h3>
        <ul className="mt-2 space-y-1">
          {designs.map((d) => (
            <li key={d.id} className="flex items-center gap-2">
              <Button
                className="flex-1 justify-start"
                variant="secondary"
                onClick={() => handleLoadDesign(d.id)}
                title={new Date(d.updatedAt).toLocaleString()}
              >
                {d.name}
              </Button>
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(d.id)}>Copy ID</Button>
              <Button variant="ghost" onClick={() => handleDeleteDesign(d.id)}>Delete</Button>
            </li>
          ))}
          {designs.length === 0 && (
            <li className="text-sm text-gray-500">No saved designs yet.</li>
          )}
        </ul>
      </div>
      {/* Compatibility hook removed: use main generate button above */}
    </div>
  );
}
