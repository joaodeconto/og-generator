"use client";

import { useState } from "react";
import { useEditorStore } from "lib/editorStore";
import { exportElementAsPng, type ImageSize } from "lib/images";
import { copyMetaTags } from "lib/meta";
import { toast } from "components/ToastProvider";
import { Button } from "@/components/ui/button";

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
      toast({ message: "Meta tags copied" });
    } catch (err) {
      toast({ message: "Failed to copy meta tags", variant: "error" });
      console.error(err);
    }
  };

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={selected === "1200x630" ? "default" : "secondary"}
          aria-label="Export size 1200 by 630"
          aria-pressed={selected === "1200x630"}
          onClick={() => setSelected("1200x630")}
        >
          1200×630
        </Button>
        <Button
          variant={selected === "1600x900" ? "default" : "secondary"}
          aria-label="Export size 1600 by 900"
          aria-pressed={selected === "1600x900"}
          onClick={() => setSelected("1600x900")}
        >
          1600×900
        </Button>
        <Button
          variant={selected === "1920x1005" ? "default" : "secondary"}
          aria-label="Export size 1920 by 1005"
          aria-pressed={selected === "1920x1005"}
          onClick={() => setSelected("1920x1005")}
        >
          1920×1005
        </Button>
      </div>
      <Button className="w-full" aria-label="Export image as PNG" onClick={handleExport}>
        Export PNG
      </Button>
      <Button className="w-full" variant="secondary" aria-label="Copy meta tags" onClick={handleCopyMeta}>
        Copy Meta
      </Button>
    </section>
  );
}

