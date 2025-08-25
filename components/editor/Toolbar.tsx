"use client";

import { useCallback, useEffect } from "react";
import { useEditorStore } from "lib/editorStore";
import { exportElementAsPng } from "lib/images";
import { buildMetaTags } from "lib/meta";

export default function Toolbar() {
  const {
    undo,
    redo,
    addPreset,
    theme,
    layout,
    accentColor,
    title,
    subtitle,
  } = useEditorStore();

  const handleUndo = useCallback(() => undo(), [undo]);
  const handleRedo = useCallback(() => redo(), [redo]);
  const handleCopyMeta = useCallback(async () => {
    const tags = buildMetaTags({ title, description: subtitle });
    try {
      await navigator.clipboard.writeText(tags);
    } catch (err) {
      console.error(err);
    }
  }, [title, subtitle]);
  const handleExport = useCallback(async () => {
    const element = document.getElementById("og-canvas");
    if (!element) return;
    try {
      await exportElementAsPng(element, { width: 1200, height: 630 });
    } catch (err) {
      console.error(err);
    }
  }, []);
  const handleSave = useCallback(() => {
    addPreset({ theme, layout, accentColor });
  }, [addPreset, theme, layout, accentColor]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (key === "c") {
        e.preventDefault();
        handleCopyMeta();
      } else if (key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo, handleRedo, handleCopyMeta, handleSave]);

  return (
    <header className="flex items-center justify-between border-b bg-background/80 p-2 backdrop-blur">
      <div className="flex gap-2">
        <button
          className="btn"
          aria-label="Undo"
          title="Undo (Cmd/Ctrl+Z)"
          onClick={handleUndo}
        >
          Undo
        </button>
        <button
          className="btn"
          aria-label="Redo"
          title="Redo (Cmd/Ctrl+Shift+Z)"
          onClick={handleRedo}
        >
          Redo
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className="btn"
          aria-label="Copy Meta"
          title="Copy Meta (Cmd/Ctrl+C)"
          onClick={handleCopyMeta}
        >
          Copy Meta
        </button>
        <button
          className="btn"
          aria-label="Export"
          title="Export"
          onClick={handleExport}
        >
          Export
        </button>
        <button
          className="btn"
          aria-label="Save"
          title="Save (Cmd/Ctrl+S)"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </header>
  );
}
