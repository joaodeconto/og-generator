"use client";

import { useCallback, useEffect } from "react";
import { useEditorStore } from "lib/editorStore";
import { exportElementAsPng } from "lib/images";
import { copyMetaTags } from "lib/meta";
import { useToast } from "components/ToastProvider";
import { Button } from "@/components/ui/button";

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
  const { save: toastSave, exportImage: toastExport, error: toastError } =
    useToast();

  const handleUndo = useCallback(() => undo(), [undo]);
  const handleRedo = useCallback(() => redo(), [redo]);
  const handleCopyMeta = useCallback(async () => {
    try {
      await copyMetaTags({ title, description: subtitle });
    } catch (err) {
      console.error(err);
    }
  }, [title, subtitle]);
  const handleExport = useCallback(async () => {
    const element = document.getElementById("og-canvas");
    if (!element) return;
    try {
      await exportElementAsPng(element, { width: 1200, height: 630 });
      toastExport();
    } catch (err) {
      toastError("Failed to export image");
      console.error(err);
    }
  }, [toastExport, toastError]);
  const handleSave = useCallback(() => {
    addPreset({ theme, layout, accentColor });
    toastSave();
  }, [addPreset, theme, layout, accentColor, toastSave]);

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
        <Button aria-label="Undo" title="Undo (Cmd/Ctrl+Z)" onClick={handleUndo}>
          Undo
        </Button>
        <Button aria-label="Redo" title="Redo (Cmd/Ctrl+Shift+Z)" onClick={handleRedo}>
          Redo
        </Button>
      </div>
      <div className="flex gap-2">
        <Button aria-label="Copy Meta" title="Copy Meta (Cmd/Ctrl+C)" onClick={handleCopyMeta}>
          Copy Meta
        </Button>
        <Button aria-label="Export" title="Export" onClick={handleExport}>
          Export
        </Button>
        <Button aria-label="Save" title="Save (Cmd/Ctrl+S)" onClick={handleSave}>
          Save
        </Button>
      </div>
    </header>
  );
}
