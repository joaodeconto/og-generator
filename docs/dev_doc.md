# OGGenerator — Base Doc & Roadmap

A concise, implementation‑ready base for the **OG Image Studio** project using **React**, **TailwindCSS**, **Vercel**, and multi‑provider **OAuth**. It covers architecture, environment, providers, and a step‑by‑step roadmap to MVP.

---

## 1) Vision & Scope

OGGenerator is a one‑page (expandable) app to **compose Open Graph images** with live preview and export presets. Users authenticate via mainstream providers and can **upload a logo** and **edit it** (translate, scale, remove background, invert B/W). The result is exportable as PNG and the app can copy a ready‑to‑paste meta‑tag block.

**MVP Goals**

---

## 2) Tech Stack

* **Framework:** Next.js (React, App Router) — SPA feel + API routes for auth and utilities.
* **Styling:** TailwindCSS + shadcn/ui for primitives (Button, Input, Textarea).
* **Auth:** NextAuth.js (Auth.js) with OAuth providers (see configuration below).
* **Storage:**
  * Local state: Zustand with undo/redo history and localStorage persistence.
  * API routes persist serialized editor state (`/api/design`).
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
│  │  ├─ remove-bg/route.ts                   # optional server-side removal (alt to WASM)
│  │  └─ design/route.ts                      # CRUD for editor persistence
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
│  ├─ ui/
│  │  ├─ button.tsx
│  │  ├─ input.tsx
│  │  └─ textarea.tsx
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
│  ├─ utils.ts                                 # className helper
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
* Layout Presets: horizontal left/center/right and vertical top/center/bottom alignment with 8px baseline.
* Logo Layer: PNG/SVG upload (drag‑and‑drop + paste). Controls below.
* Background: solid color selection with undo/redo support.

**Logo Controls**

* **Translate**: click‑drag in canvas with positions clamped to bounds; fine‑tune with arrow keys (Shift = 10×). Element scale remains constant near edges. Undo history commits once on release.
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
* [ ] Choose storage strategy (KV + Blob *or* Supabase) and implement abstraction.
* [ ] Save/load **Design** documents per user.
* [ ] **Layout presets**:  Add more, reset, auto-layout, auto fit
* [ ] **Edge feedback**: add visual indicator when dragging near boundaries (deformation removed)
* [x] **Remove Backgroun** processo lento, Mostrar loading.
* [ ] **Invert B/W** improve.
* [ ] Hi‑DPI export (2× then downscale) to PNG.
* [x] **Size presets**: added dimension presets and updated Canvas
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
* `ToastProvider` expõe `useToast` com mensagens padrão de salvar, exportar e erros em remoção de fundo ou busca de metadata.

---


# Persist session in Zustand
Date: 2025-08-26
Status: accepted
Context: Header needed persisted auth state to show avatar dropdown across routes.
Decision: Introduced `lib/sessionStore` with Zustand `persist` and synced `AuthButtons` via `useSession`.
Consequences: Session info lives in localStorage and is accessible app-wide; must clear store on sign-out.
Links: PR TBD

# Copy OG/Twitter meta block with toast
Date: 2025-08-26
Status: accepted
Context: Users need a quick way to generate and copy SEO meta tags.
Decision: Added `buildMetaTags` utility and Export panel button that copies tags to clipboard with toast feedback.
Consequences: Streamlines publishing workflow; relies on Clipboard API availability.
# Integrate shadcn tooltip component
Date: 2025-08-26
Status: accepted
Context: Needed accessible tooltips and visible focus styles for editor controls.
Decision: Added shadcn/ui Tooltip primitive and audited interactive elements with focus-visible ring styling.
Consequences: Improved keyboard navigation and discoverability of actions; future components should reuse these patterns.
Links: PR TBD

# Guard font readiness in exportElementAsPng
Date: 2025-08-26
Status: accepted
Context: `document.fonts` may be undefined in some environments, causing export to fail.
Decision: Check for the Fonts API before awaiting `document.fonts.ready` when exporting images.
Consequences: Ensures PNG export works in browsers lacking `document.fonts` support.
Links: PR TBD

# Avoid empty logo src in CanvasStage
Date: 2025-08-26
Status: accepted
Context: Next.js warned when the logo `<Image>` rendered with an empty `src`.
Decision: Destructure `useProcessedLogo` and render the logo only when a data URL exists.
Consequences: Eliminates spurious image requests and console errors.
Links: PR TBD

# Drop edge deformation in Draggable
Date: 2025-08-26
Status: accepted
Context: Scaling the logo near canvas edges caused visual distortion and conflicted with position clamping.
Decision: Remove deformation logic; keep position clamping so the logo stays fully visible.
Consequences: Simplifies drag behavior; consider adding a different edge indicator later.
Links: PR TBD

# Proxy remote images for background removal
Date: 2025-08-27
Status: accepted
Context: `removeBackground` failed on third-party logos due to CORS restrictions.
Decision: Normalize URLs via `ensureSameOriginImage` before invoking `removeImageBackground`.
Consequences: Background removal works for external logos through the `/api/image` proxy with minimal overhead.
Links: PR TBD

# Symmetric canvas edge clamping in Draggable
Date: 2025-09-01
Status: accepted
Context: Right-edge clamping was explicit but other sides relied on implicit behavior, confusing users.
Decision: Compute explicit min/max percentages for both axes and clamp against all four canvas edges.
Consequences: Dragging stops uniformly at each boundary without visual scaling.
Links: PR TBD

# Center-stable scaling in Draggable
Date: 2025-09-01
Status: accepted
Context: CSS transform order caused translation to be scaled, making elements appear to shrink near canvas edges.
Decision: Apply `scale()` before `translate()` so elements scale around their center without drifting.
Consequences: Dragging a scaled element no longer distorts its apparent size when clamped to an edge.
Links: PR TBD
