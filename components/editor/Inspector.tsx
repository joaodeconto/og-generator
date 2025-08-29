"use client";
import { useState } from "react";
import CanvasPanel from "./panels/CanvasPanel";
import TextPanel from "./panels/TextPanel";
import LogoPanel from "./panels/LogoPanel";
import ExportPanel from "./panels/ExportPanel";
import MetadataPanel from "./panels/MetadataPanel";
import PresetsPanel from "./panels/PresetsPanel";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "canvas", label: "Canvas", component: CanvasPanel },
  { id: "metadata", label: "Metadata", component: MetadataPanel },
  { id: "text", label: "Text", component: TextPanel },
  { id: "logo", label: "Logo", component: LogoPanel },
  { id: "export", label: "Export", component: ExportPanel },
  { id: "presets", label: "Presets", component: PresetsPanel },
];

export default function Inspector() {
  const [active, setActive] = useState("canvas");
  const ActivePanel = tabs.find(t => t.id === active)?.component || CanvasPanel;

  return (
    <div className="h-full rounded-2xl border bg-card p-3 shadow-sm">
      <div
        className="mb-4 flex gap-2 border-b pb-2 text-sm"
        role="tablist"
        aria-label="Editor panels"
      >
        {tabs.map(tab => (
          <Button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            variant={active === tab.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
      >
        <ActivePanel />
      </div>
    </div>
  );
}
