"use client";
import Toolbar from "./Toolbar";
import CanvasStage from "../CanvasStage";
import CanvasToolbar from "../CanvasToolbar";
import Inspector from "./Inspector";

export default function EditorShell() {
  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col pb-24 lg:pb-0">
      <Toolbar />
      {process.env.NODE_ENV !== "production" && (
        <div className="mx-4 mt-2 rounded-md border bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Dev tip: use Presets to start with a template; save designs for quick reuse.
        </div>
      )}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">        
          <div className="h-full rounded-2xl border bg-card shadow-sm p-3">
            <CanvasStage />
          </div>
        </div>
        <aside className="col-span-12 xl:col-span-4 2xl:col-span-3 lg:static fixed bottom-0 left-0 right-0 z-30">
          <div className="rounded-t-2xl border bg-card p-3 shadow-xl xl:rounded-2xl xl:shadow-sm">
            <Inspector />
          </div>
        </aside>
      </div>
    </div>
  );
}
