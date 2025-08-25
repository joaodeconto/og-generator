"use client";

export default function Toolbar() {
  return (
    <header className="flex items-center justify-between border-b bg-background/80 p-2 backdrop-blur">
      <div className="flex gap-2">
        <button className="btn" aria-label="Undo">Undo</button>
        <button className="btn" aria-label="Redo">Redo</button>
      </div>
      <div className="flex gap-2">
        <button className="btn" aria-label="Copy Meta">Copy Meta</button>
        <button className="btn" aria-label="Export">Export</button>
        <button className="btn" aria-label="Save">Save</button>
      </div>
    </header>
  );
}
