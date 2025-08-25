"use client";

import { useEffect } from "react";

export default function Toolbar() {
  const handleUndo = () => console.log("undo");
  const handleRedo = () => console.log("redo");
  const handleCopyMeta = () => console.log("copy meta");
  const handleExport = () => console.log("export");
  const handleSave = () => console.log("save");

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
