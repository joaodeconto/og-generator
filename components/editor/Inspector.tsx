"use client";
import { useState } from "react";
import CanvasPanel from "./panels/CanvasPanel";
import TextPanel from "./panels/TextPanel";
import LogoPanel from "./panels/LogoPanel";
import ExportPanel from "./panels/ExportPanel";
import MetadataPanel from "../MetadataPanel";
import PresetsPanel from "../PresetsPanel";

const tabs = [
  { id: "canvas", label: "Canvas", component: CanvasPanel },
  { id: "text", label: "Text", component: TextPanel },
  { id: "logo", label: "Logo", component: LogoPanel },
  { id: "metadata", label: "Metadata", component: MetadataPanel },
  { id: "presets", label: "Presets", component: PresetsPanel },
  { id: "export", label: "Export", component: ExportPanel }
];

export default function Inspector() {
  const [active, setActive] = useState("canvas");
  const ActivePanel = tabs.find(t => t.id === active)?.component || CanvasPanel;

  return (
    <div className="h-full rounded-2xl border bg-card p-3 shadow-sm">
      <div className="mb-4 flex gap-2 border-b pb-2 text-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-2 py-1 ${active === tab.id ? "border-b-2" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActivePanel />
    </div>
  );
}
