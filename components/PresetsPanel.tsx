"use client";

import { useEditorStore } from 'lib/editorStore';
import { generateRandomPreset } from 'lib/randomStyle';

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
      <button
        onClick={handleGeneratePreset}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Gerar Preset Aleatório
      </button>
      <ul className="space-y-2">
        {presets.map((preset, index) => (
          <li key={index}>
            <button
              onClick={() => applyPreset(preset)}
              className="flex w-full items-center justify-between rounded-md border px-2 py-1 text-left hover:bg-gray-50"
            >
              <span className="text-sm">
                {preset.theme} / {preset.layout}
              </span>
              <span
                className="h-4 w-4 rounded"
                style={{ backgroundColor: preset.accentColor }}
              />
            </button>
          </li>
        ))}
        {presets.length === 0 && (
          <li className="text-sm text-gray-500">Nenhum preset salvo.</li>
        )}
      </ul>
    </div>
  );
}
