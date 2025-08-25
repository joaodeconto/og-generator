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
