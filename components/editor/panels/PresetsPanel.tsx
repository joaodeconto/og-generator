"use client";

import { useEditorStore } from 'lib/editorStore';
import { generateRandomPreset } from 'lib/randomStyle';
import { Button } from '@/components/ui/button';

/**
 * Panel that allows creating random style presets and applying them.
 * Presets are stored in the global editor store so they can be reused
 * across different sessions in the UI.
 */
export default function PresetsPanel() {
  const { presets, addPreset, applyPreset } = useEditorStore();

  const handleGeneratePreset = () => {
    const preset = generateRandomPreset();
    addPreset(preset);
    applyPreset(preset);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Presets</h2>
      <Button onClick={handleGeneratePreset}>
        Gerar Preset Aleatório
      </Button>
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
          <li className="text-sm text-gray-500">Nenhum preset salvo.</li>
        )}
      </ul>
    </div>
  );
}
