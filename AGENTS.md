# agent.md — Design & UX Agent for OGGenerator

> Purpose: Guide an AI/dev agent to redesign the editor UI so controls aren’t a tall stack of commands. Adopt a Figma/Canva-style layout with a central canvas, a right-side inspector, and a minimal quick toolbar. Ship a working skeleton in React + Tailwind + shadcn/ui.

---

## 0) Principles

* **Canvas-first**. Large preview, crisp scaling, zoom-to-fit.
* **Group controls** in Tabs/Accordion: Canvas, Text, Logo, Export.
* **Minimal top toolbar**: Undo/Redo, Export, Copy Meta, Save, Theme.
* **Direct manipulation**: drag to translate, handles to scale on-canvas.
* **Preset thumbnails** for backgrounds/layouts instead of dropdowns.
* **Responsive**: desktop split (canvas | inspector), mobile sheet for controls.
* **A11y**: focus rings, ARIA labels, keyboard shortcuts.

---

## 1) Deliverables

1. **Layout skeleton** (components + routes) using React/Next.js + Tailwind.
2. **Canvas preview** with HTML `<canvas>` and resize observer.
3. **Inspector** with Tabs (Canvas/Text/Logo/Export) using shadcn/ui.
4. **Quick Toolbar** with core actions + toasts.
5. **Keyboard shortcuts** (Cmd/Ctrl+S export, Cmd/Ctrl+C copy meta).
6. **Responsive behavior** (drawer/sheet on mobile).

---

## 2) File Map (suggested)

```
src/app/(editor)/page.tsx
src/components/editor/EditorShell.tsx
src/components/editor/CanvasStage.tsx
src/components/editor/Toolbar.tsx
src/components/editor/Inspector.tsx
src/components/editor/panels/CanvasPanel.tsx
src/components/editor/panels/TextPanel.tsx
src/components/editor/panels/LogoPanel.tsx
src/components/editor/panels/ExportPanel.tsx
lib/editorStore.ts
```

---

## 3) UI Wireframe (JSX + Tailwind)

> Drop-in skeleton; replace stubs with real state/logic. Uses shadcn/ui primitives (Tabs, Tooltip, Button, Slider, Separator, Sheet) without importing from @/components/ui here to keep it framework-agnostic.

```tsx
// src/components/editor/EditorShell.tsx
"use client";
import { useEffect, useRef, useState } from "react";
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
```

```tsx
// src/components/editor/CanvasStage.tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function CanvasStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const base = { w: 1200, h: 630 };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = el;
      const scale = Math.min(clientWidth / base.w, clientHeight / base.h);
      setZoom(scale * 0.98); // small padding
      // redraw on resize
      draw();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Background placeholder
    ctx.fillStyle = "#0b0c0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Title placeholder
    ctx.fillStyle = "white";
    ctx.font = "bold 48px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("OGGenerator — Title", 64, 180);
    // Subtitle placeholder
    ctx.font = "24px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillStyle = "#D1D5DB";
    ctx.fillText("Subtitle goes here", 64, 240);
    // Logo placeholder (circle)
    ctx.beginPath();
    ctx.arc(canvas.width - 140, canvas.height - 140, 64, 0, Math.PI * 2);
    ctx.fillStyle = "#22d3ee";
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Render @2x then CSS scale by zoom for crispness
    canvas.width = 1200 * 2;
    canvas.height = 630 * 2;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(2, 2);
    draw();
  }, [zoom]);

  return (
    <div ref={containerRef} className="h-full w-full grid place-items-center">
      <div style={{ transform: `scale(${zoom})` }} className="origin-top">
        <canvas
          ref={canvasRef}
          className="rounded-xl shadow-md border"
          style={{ width: 1200, height: 630 }}
        />
      </div>
    </div>
  );
}
```

```tsx
// src/components/editor/Toolbar.tsx
"use client";
import { useState } from "react";

export default function Toolbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  return (
    <header className="h-14 border-b bg-card/70 backdrop-blur flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-xl bg-primary" />
        <span className="font-semibold">OG Image Studio</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn">Undo</button>
        <button className="btn">Redo</button>
        <div className="w-px h-6 bg-border mx-2" />
        <button className="btn btn-primary">Export PNG</button>
        <button className="btn">Copy Meta</button>
        <button className="btn">Save</button>
        <div className="w-px h-6 bg-border mx-2" />
        <button className="btn" onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}>
          {theme === "dark" ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}
```

```tsx
// src/components/editor/Inspector.tsx
"use client";
import CanvasPanel from "./panels/CanvasPanel";
import TextPanel from "./panels/TextPanel";
import LogoPanel from "./panels/LogoPanel";
import ExportPanel from "./panels/ExportPanel";
import { useState } from "react";

const tabs = ["Canvas", "Text", "Logo", "Export"] as const;

type Tab = typeof tabs[number];

export default function Inspector() {
  const [tab, setTab] = useState<Tab>("Canvas");
  return (
    <div className="rounded-2xl border bg-card shadow-sm h-full flex flex-col">
      <div className="p-2 border-b flex gap-2 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            className={`px-3 py-1.5 rounded-lg text-sm ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {tab === "Canvas" && <CanvasPanel />}
        {tab === "Text" && <TextPanel />}
        {tab === "Logo" && <LogoPanel />}
        {tab === "Export" && <ExportPanel />}
      </div>
    </div>
  );
}
```

```tsx
// src/components/editor/panels/CanvasPanel.tsx
"use client";
export default function CanvasPanel() {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Background</h3>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <button key={i} className="aspect-video rounded-lg border bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2"><input type="radio" name="theme" /> Light</label>
        <label className="flex items-center gap-2"><input type="radio" name="theme" /> Dark</label>
      </div>
      <div>
        <h4 className="font-medium mb-1">Layout</h4>
        <div className="grid grid-cols-3 gap-2">
          {(["Left", "Center", "Full"]).map(l => (
            <button key={l} className="p-2 rounded-lg border bg-muted text-sm">{l}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

```tsx
// src/components/editor/panels/TextPanel.tsx
"use client";
export default function TextPanel() {
  return (
    <section className="space-y-3">
      <label className="block">
        <span className="text-sm">Title</span>
        <input className="mt-1 w-full rounded-lg border bg-background px-3 py-2" placeholder="Your awesome title" />
      </label>
      <label className="block">
        <span className="text-sm">Subtitle</span>
        <textarea className="mt-1 w-full rounded-lg border bg-background px-3 py-2" rows={3} placeholder="Short description" />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">XS</button>
        <button className="btn">MD</button>
        <button className="btn">XL</button>
      </div>
    </section>
  );
}
```

```tsx
// src/components/editor/panels/LogoPanel.tsx
"use client";
export default function LogoPanel() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <input type="file" accept="image/png,image/svg+xml" />
        <button className="btn">Paste</button>
        <button className="btn">From URL</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">Remove BG</button>
        <button className="btn">Invert B/W</button>
        <button className="btn">Mask: Circle</button>
      </div>
      <div>
        <label className="text-sm">Scale</label>
        <input type="range" min={0.2} max={3} step={0.01} className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn">Reset</button>
        <button className="btn">Center</button>
      </div>
    </section>
  );
}
```

```tsx
// src/components/editor/panels/ExportPanel.tsx
"use client";
export default function ExportPanel() {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">1200×630</button>
        <button className="btn">1600×900</button>
        <button className="btn">1920×1005</button>
      </div>
      <button className="btn btn-primary w-full">Export PNG</button>
      <button className="btn w-full">Copy Meta</button>
    </section>
  );
}
```

```tsx
// src/app/(editor)/page.tsx
import EditorShell from "@/components/editor/EditorShell";
export default function Page() { return <EditorShell />; }
```

```ts
// tailwind.css helpers (optional class shortcuts)
// Add to globals.css or use @apply
// .btn { @apply px-3 py-1.5 rounded-lg border bg-muted hover:bg-muted/80 text-sm; }
// .btn-primary { @apply bg-primary text-primary-foreground hover:bg-primary/90; }
```

---

## 4) Interaction Checklist

* [ ] Drag on-canvas to **translate** logo.
* [ ] Show **resize handles** on logo hover/selection for scaling.
* [ ] Keyboard: **Arrows** (move by 1px), **Shift+Arrows** (10px).
* [ ] **Cmd/Ctrl+S** → export PNG (default size).
* [ ] **Cmd/Ctrl+C** → copy meta block.
* [ ] Toasts for success/error.

---

## 5) Integration Notes

* State: wire to `editorStore` (Zustand) later; keep props/stubs now.
* Export: render @2x in canvas, then downscale to target size before `toBlob`.
* Future: background-removal WASM in a WebWorker; invert via canvas filter.
* A11y: labels and `aria-*` on all inputs; focus outlines visible.

---

## 6) Definition of Done

* Central canvas scales to fit container, renders placeholders.
* Inspector with four tabs; controls grouped (no vertical command stack).
* Toolbar minimal and sticky.
* Responsive: inspector collapses into a sheet/drawer on small screens.
* Export buttons present and wired to placeholder handlers.

---

## 7) Next Steps (Post-skeleton)

* Wire actual editor state (title/subtitle/theme/layout/bg/logo).
* Implement drag/scale/mask interactions and selection bounds.
* Image pipeline: remove BG (WASM), invert, mask (clipPath) with preview.
* Export pipeline with font loading guards.
* Persist designs locally and in cloud (KV + Blob or Supabase).
