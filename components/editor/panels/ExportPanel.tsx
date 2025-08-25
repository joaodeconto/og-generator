"use client";

import { useState } from "react";
import { useEditorStore } from "lib/editorStore";
import { exportElementAsPng, type ImageSize } from "lib/images";
import { copyMetaTags } from "lib/meta";

const SIZE_PRESETS: Record<string, ImageSize> = {
  "1200x630": { width: 1200, height: 630 },
  "1600x900": { width: 1600, height: 900 },
  "1920x1005": { width: 1920, height: 1005 },
};

export default function ExportPanel() {
  const [selected, setSelected] = useState<keyof typeof SIZE_PRESETS>("1200x630");
  const { title, subtitle } = useEditorStore();

  const handleExport = async () => {
    const el = document.getElementById("og-canvas");
    if (!el) {
      console.error("Canvas element #og-canvas not found");
      return;
    }
    try {
      await exportElementAsPng(
        el as HTMLElement,
        SIZE_PRESETS[selected],
        `og-image-${selected}.png`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyMeta = async () => {
    try {
      await copyMetaTags({ title, description: subtitle });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {Object.keys(SIZE_PRESETS).map((key) => (
          <button
            key={key}
            className={`btn${selected === key ? " btn-primary" : ""}`}
            onClick={() => setSelected(key as keyof typeof SIZE_PRESETS)}
          >
            {key.replace("x", "×")}
          </button>
        ))}
      </div>
      <button className="btn btn-primary w-full" onClick={handleExport}>
        Export PNG
      </button>
      <button className="btn w-full" onClick={handleCopyMeta}>
        Copy Meta
      </button>
    </section>
  );
}
