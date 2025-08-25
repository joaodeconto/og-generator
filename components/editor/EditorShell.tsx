"use client";
import Toolbar from "./Toolbar";
import CanvasStage from "./CanvasStage";
import Inspector from "./Inspector";

export default function EditorShell() {
  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col">
      <Toolbar />
      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="h-full rounded-2xl border bg-card shadow-sm p-3">
            <CanvasStage />
          </div>
        </div>
        <aside className="col-span-12 xl:col-span-4 2xl:col-span-3">
          <Inspector />
        </aside>
      </div>
    </div>
  );
}
