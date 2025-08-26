"use client";

import { useCallback, useEffect } from "react";
import { useEditorStore } from "lib/editorStore";
import { exportElementAsPng } from "lib/images";
import { copyMetaTags } from "lib/meta";
import { useToast } from "components/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <header className="flex items-center justify-between border-b bg-background/80 p-2 backdrop-blur">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Undo" onClick={handleUndo}>
                Undo
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Cmd/Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Redo" onClick={handleRedo}>
                Redo
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Cmd/Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Copy Meta" onClick={handleCopyMeta}>
                Copy Meta
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Meta (Cmd/Ctrl+C)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Export" onClick={handleExport}>
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export PNG</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Save" onClick={handleSave}>
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save (Cmd/Ctrl+S)</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
