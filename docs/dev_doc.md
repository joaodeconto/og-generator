# OGGenerator — Base Doc & Roadmap

A concise, implementation‑ready base for the **OG Image Studio** project using **React**, **TailwindCSS**, **Vercel**, and multi‑provider **OAuth**. It covers architecture, environment, providers, and a step‑by‑step roadmap to MVP.

---

## 1) Vision & Scope

OGGenerator is a one‑page (expandable) app to **compose Open Graph images** with live preview and export presets. Users authenticate via mainstream providers and can **upload a logo** and **edit it** (translate, scale, remove background, invert B/W). The result is exportable as PNG and the app can copy a ready‑to‑paste meta‑tag block.

**MVP Goals**

---

## 2) Tech Stack

* **Framework:** Next.js (React, App Router) — SPA feel + API routes for auth and utilities.
* **Styling:** TailwindCSS + shadcn/ui (optional) for primitives (Toasts, Dialog, Slider).
* **Auth:** NextAuth.js (Auth.js) with OAuth providers (see configuration below).
* **Storage:**
  * Local state: Zustand with undo/redo history and localStorage persistence.
  * Object storage for uploads (logo): Vercel Blob **or** Supabase Storage/S3‑compatible bucket.
* **Image Processing:** HTMLCanvas + OffscreenCanvas + WebWorker. For **background removal**, a dedicated worker lazy-loads `@imgly/background-removal` and caches the WASM model.
* **Validation/Config:** Zod + TypeScript.
* **Telemetry:** Vercel Analytics (optional: PostHog if desired).
* **Testing:** Jest + React Testing Library.

---

## 3) Project Structure

```
/ (repo root)
├─ app/
│  ├─ api/
│  │  ├─ auth/[...nextauth]/route.ts          # NextAuth handlers
│  │  ├─ upload/route.ts                      # signed upload / server utilities
│  │  └─ remove-bg/route.ts                   # optional server-side removal (alt to WASM)
│  ├─ (editor)/page.tsx                       # main editor page
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ AuthButtons.tsx
│  ├─ CanvasStage.tsx
│  ├─ Draggable.tsx
│  ├─ ErrorBoundary.tsx
│  ├─ Providers.tsx
│  ├─ ToastProvider.tsx
│  └─ editor/
│     ├─ EditorShell.tsx
│     ├─ Inspector.tsx
│     ├─ Toolbar.tsx
│     └─ panels/
│        ├─ CanvasPanel.tsx
│        ├─ TextPanel.tsx
│        ├─ LogoPanel.tsx
│        └─ ExportPanel.tsx
├─ lib/
│  ├─ auth.ts                                  # NextAuth config
│  ├─ editorStore.ts                           # Zustand store + undo/redo
│  ├─ images.ts                                # canvas helpers (scale/export/invert, font-ready @2x)
│  ├─ meta.ts                                  # build OG/Twitter meta tags
│  ├─ randomStyle.ts
│  ├─ removeBg.ts                              # WASM loader + pipeline
│  └─ hooks/
│     └─ useProcessedLogo.ts                   # prepares logo image (BG removal + inversion) and exposes loading state
├─ state/
│  └─ editorStore.ts                           # re-export for convenience
├─ workers/
│  ├─ export.worker.ts                         # off-thread PNG export
│  └─ removeBgWorker.ts                        # background removal worker
├─ types/
│  └─ index.d.ts
├─ public/
│  └─ fonts/*
├─ .env.local.example
├─ tailwind.config.ts
├─ postcss.config.js
├─ next.config.js
├─ package.json
└─ README.md


---

## 5) Editor — Functional Spec

**Canvas Stage**

* Canvas size presets (1200×630, 1600×900, 1920×1005). Zoom to fit viewport, render at 2× for crisp export.
* 
* Text: Title + Subtitle with smart clamp, max width, balance (`text-wrap: balance`).
* Layout Presets: horizontal left/center/right and vertical top/center/bottom alignment with 8px baseline.
* Logo Layer: PNG/SVG upload (drag‑and‑drop + paste). Controls below.

**Logo Controls**

* **Translate**: click‑drag in canvas; fine‑tune with arrow keys (Shift = 10×).
* **Scale**: pinch/scroll over logo; numeric slider with min/max.
* **Manual Position**: X/Y number inputs in Logo panel update with drag.
* **Remove Background**: client‑side WASM U^2‑Net; fallback API route.
* **Invert B/W**: canvas filter (luminance threshold + invert) — preview toggle.
* **Mask (Circle)**: optional clipPath for avatars.
* **Loading indicator**: spinner while logo processing is running.
* **Position**: X/Y sliders for precise placement; Undo/Redo available via global toolbar.

---

## 10) Dev & Build Setup

**Install**

```
pnpm i
pnpm dlx shadcn-ui@latest init   # optional UI kit
pnpm dev
```

**Vercel**

* Import repo → set environment vars → `vercel build` should pass → `vercel deploy`.
* Add OAuth callback URLs in each provider’s console (prod + localhost).

---

## 11) Security & Compliance

* Store only minimal profile data.
* Sanitize uploaded images (restrict to PNG/SVG; if SVG, sanitize via whitelist and rasterize to PNG with OffscreenCanvas before use).
* CSRF handled by NextAuth; enforce HTTPS in production.
* Rate‑limit the remove‑BG API route if enabled.

---

## 12) Testing

* Unit: utils (meta builder, image ops) via Jest.
* Component: ControlsPanel, CanvasStage with React Testing Library + JSDOM.
* E2E: Playwright for auth flow (Google + GitHub at least) and PNG export.

---

## 13) TODO

* [ ] Add shadcn/ui primitives (Button, Slider, Dialog, Toast, Tooltip).
* [ ] **Session header**: AuthButtons handles sign-in/out; avatar + menu pending.
* [ ] Choose storage strategy (KV + Blob *or* Supabase) and implement abstraction.
* [ ] Save/load **Design** documents per user.
* [ ] **Text layers** (Title/Subtitle) with clamp + balance (basic inputs exist).
* [ ] **Background**: solid/gradient/image (with object‑fit cover, position).
* [ ] **Layout presets**:  Add more, reset, auto-layout, auto fit
* [ ] **Resize on boundries**: Improve featur, it flicks when dragging close to border
* [x] **Remove Backgroun** processo lento, Mostrar loading.
* [ ] **Invert B/W** improve.
* [ ] Hi‑DPI export (2× then downscale) to PNG.
* [x] **Size presets**: added dimension presets and updated Canvas
* [ ] Copy OG/Twitter meta block with toast feedback.
* [ ] **Tooltips** and polished focus states; basic ARIA labels present.
* [ ] **Toasts** for every user action.
* [ ] Minimal **analytics** (Vercel Analytics).
* [ ] Media import prototype.
* [ ] **Preset templates** (Blog, Product, Event, Promo, App Launch).
* [ ] **Shareable links** (design ID) with view permissions.
* [ ] Batch render from CSV/JSON (programmatic OGs).
* [ ] **Theming system** + brand kits.

---

## 18) Error Handling

* `ErrorBoundary` envolve o `EditorShell` exibindo um fallback amigável.
* `ToastProvider` fornece notificações para falhas em remoção de fundo, exportação e busca de metadata.

---

