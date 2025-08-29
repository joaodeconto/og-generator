# OGGenerator - Base Doc & Roadmap

A concise, implementation-ready base for the OG Image Studio using React, Tailwind CSS, Next.js, and multi-provider OAuth. It covers architecture, environment, providers, functional specs, UI/UX guidelines, and a roadmap to MVP.

---

## 1) Vision & Scope

OGGenerator is a one-page (expandable) app to compose Open Graph images with live preview and export presets. Users authenticate via mainstream providers and can upload a logo and edit it (translate, scale, remove background, invert B/W). The result is exportable as PNG and the app can copy a ready-to-paste meta-tag block.

MVP Goals
- Auth with Google and GitHub via NextAuth.
- Scrape Sites and use best images
- Canvas editor and tools with multiple modifiers.
- Logo processing (background removal, B/W invert, mask, scale, rotate, align).
- PNG export with predefined sizes (2x presets planned).
- Pixel perfetc canvas and proportions in different windown dimentions
---

## 2) Tech Stack - Always Evaluate

- Framework: Next.js (React, App Router) - SPA feel + API routes for auth and utilities.
- Styling: Tailwind CSS + shadcn/ui (Button, Input, Textarea, Tooltip).
- Auth: NextAuth.js (Auth.js) with OAuth providers.
- Storage:
  - Local state: Zustand with undo/redo history and localStorage persistence.
  - API routes persist serialized editor state (`/api/design`).
  - Object storage for uploads (logo): Vercel Blob or Supabase Storage/S3-compatible bucket (TBD).
- Image Processing: HTMLCanvas + OffscreenCanvas + WebWorker. Background removal via worker that lazy-loads `@imgly/background-removal` and caches the WASM model.
- Validation/Config: Zod + TypeScript.
- Telemetry: Vercel Analytics (optional: PostHog).
- Testing: Jest + React Testing Library.

---

## 4) Layout & UX Design (Detailed)

Design goals: precision, predictability, touch friendly, and fast iteration. Focus on uncluttered controls, strong defaults, and contextual help.

- Layout grid: 8px baseline; 24px page padding; 16px panel padding; 12px control spacing; 8px inline icon spacing.
- Page frame:
  - Header: left logo/title(public/logo.png), center optional breadcrumb, right session/avatar (AuthButtons) and Help menu.
  - Toolbar (above or below canvas):
    - Primary actions: Export (primary button), Copy Meta, Save.
    //TODO remove this - Secondary: Undo/Redo, Zoom (planned), Reset.
    - Disable Export while fonts not ready; show progress bar for background removal.
  - Body: two-column layout on desktop (Canvas left, Inspector right). On small screens, Inspector becomes a bottom sheet/drawer.
- CanvasToolBar: Over CanvasStage, shows available tools for correspondent selected Object ( Logo, Title, Subtitle)

- Canvas stage:
  - Centered in available space with 32px gutters; zoom-to-fit if needed(apply)
  - Safe area outline (optional toggle) and subtle canvas shadow to separate from background.
  - ensure cross dimesions compatibility
- Inspector (right column):
  - Tabs order: Canvas, Metadata, Text, Logo, Export,  Presets
  - Ensure XL:SM fitting for pannel buttons, constrain if needed
  - Each panel uses a small title, compact sections, and helper text beneath advanced controls.
  - Prefer inline controls over modal dialogs. Use collapsible sections for Advanced.
- PresetsPanel:
  - Templates grid (Blog, Product, Event, Promo, App Launch) with favorites.
  - Saved designs list; empty state prompts: Add logo and Set title.
  - Optional brand kit (future): logo variants, color swatches; quick-apply.
- Text hierarchy:
  - Title: default 72px, 700 weight; Subtitle: 36px, 400; both clamp to canvas width with 1.3 line-height.
  - Auto-wrap with max 2 lines (Title) and 3 lines (Subtitle); ellipsis beyond; show counter feedback as text approaches limits.
- Color & themes:
  - Background color swatches (8 curated + custom). Ensure WCAG AA contrast for Title/Subtitle defaults; auto-switch text color if contrast < 4.5:1.
  - Provide eyedropper (if supported) or hex input with validation.
- Logo handling:
  - Minimum size 64px; default dropped size scales to fit max 40% of canvas width.
  - Maintain aspect ratio; scale range 0.2x to 3x. Show bounding box only on focus/hover.
- Drag & nudge behavior:
  - Pointer drag clamps logo fully inside canvas; no resizing during move.
  - Arrow keys move 1px; Shift+Arrows move 8px. Shift+Up/Down scales logo by 2% steps.
  - Show alignment guides when near center lines or text baselines (snap radius 6px; animated guide lines).
  - Each drag gesture commits a single undo entry on pointerup/escape.
- Feedback & states:
  - Toasts: saved, exported, copied, and errors (background removal/scrape/invalid SVG) with consistent titles and descriptions.
  - Background removal shows spinner over logo with dimmed mask; cancel action available.
  - Font readiness gate prevents export until loaded; show small inline loader next to Export.
- Accessibility:
  - Roving tabindex in toolbar and inspector; all actions reachable by keyboard.
  - Focus-visible ring (2px) and larger target sizes (44x44 minimum) for touch.
  - ARIA: aria-pressed for toggles, aria-live=polite for toasts, labels for sliders and numeric inputs.
  - Reduced motion: disable snapping animation when prefers-reduced-motion.
- Responsive patterns:
  - Ensure inspector and other parts of layout have rolling options for adding "infinite" buttons, tabs etc.
  - < 1024px: Inspector collapses to bottom drawer with tab bar.
  - < 640px: Controls stack vertically; export and copy meta sit in sticky footer.
- Visual tokens:
  - Spacing: 4/8/12/16/24/32.
  - Radii: 6 for inputs, 10 for cards.
  - Icon sizes: 16 in buttons, 20 in panel headers.

---

## 5) Editor - Functional Spec

Canvas Stage
Auto-position toggle added (Canvas panel) to place title/subtitle/logo based on layout/vertical.
- Layout presets: horizontal left/center/right and vertical top/center/bottom alignment with 8px baseline.
- Background: solid color selection with undo/redo support.

Logo Controls
Pointer-first interactions prioritized; 
- Translate: pointer drag with clamped positions; Element scale remains constant. Undo history commits once on release.
Apply: Photoshop-style bounding box handles for scaling.
- Scale: pinch/scroll over logo; numeric slider with min/max.
- Manual Position: X/Y number inputs in Logo panel update with drag.

Dragging Quality (Critical)
- Dragging is a first-class interaction and must be precise, predictable, and accessible.
Addressed: added option to freeze element width while dragging to prevent resize on release.
- Requirements: no unintended resizing while moving; symmetric clamping at all edges, real clapmig to borders; 
- Test anchors: `__tests__/draggable.test.tsx`, `__tests__/canvas-drag.test.tsx`, `__tests__/use-logo-keyboard-controls.test.tsx`.



## 6) User Flows (Proposed)

Presets now focus on templates and saved designs. Quick URL import is out of scope for Presets (can move to Metadata panel in the future).

First Run / Onboarding
- Step 1: Choose a template (or start blank). PresetsPanel is opened by default with Featured + Recent.
- Step 2: Upload a logo (drag-and-drop, click to upload, or paste). Show crop/mask controls after load.
- Step 3: Set title and subtitle. Provide length guidance and live wrap preview.
- Persist hasSeenOnboarding in localStorage; show Tips link to reveal again.

Editing Flow
- Inspector tabs progress left-to-right: Presets -> Canvas -> Text -> Logo -> Export.
- Keyboard parity: after any mouse interaction, arrow keys nudge the last focused element; Esc clears focus.
- Guides appear near alignment targets; a small magnet icon toggles snapping.

Export Flow
- Export sizes: 1200x630 (default), 1600x836, 800x418, custom (advanced).
- Name: {title-or-slug}_{size}_{yyyymmdd-hhmm}.png.
- Copy Meta: copies OG + Twitter meta block with current export URL.
- Guard: disable export until fonts ready; show loader with remaining families.

Integrated into PresetsPanel: Save/Load designs with in-memory API + local list.
Save/Load Designs
- Auto-save on major actions (title/subtitle change, logo position/scale, background color).
- Manual Save button shows toast with design ID.
- Designs list (future): grid with thumbnails; search, sort by updated; duplicate and rename.

Error Recovery
- Background removal failure: fallback to original image, sticky banner with retry.
- Invalid SVG: sanitize or rasterize; if blocked, show details and a workaround link.

---

## 9) Security & Privacy

- Proxy third-party images via `/api/image` to avoid CORS and to control content type.
- Sanitize uploaded images (restrict to PNG/SVG; if SVG, sanitize via whitelist and rasterize to PNG with OffscreenCanvas).
- Block private/loopback hosts in proxy; send realistic UA/accept headers; special-case referer for known hosts.

---

Dev-mode banner added with in-app tip; session feedback/logging can be extended next.
## 11) Testing Strategy

- Unit: utilities in `lib/*`, including `images.ts` (export/invert/sanitize) and `meta.ts`.
- Component: panels and CanvasStage with React Testing Library + JSDOM.
- Component (dragging): assert clamp at all edges, scale-before-translate transform, keyboard parity, and no resize while dragging.
- Visual behavior: guide lines appear near center, snapping radius respected, single undo per drag.
- A11y: tab order, focus-visible rings, ARIA labels, reduced motion preferences.
- E2E (planned): Playwright for auth flow and PNG export.

---


## 13) TODO
- [ ] Choose storage strategy (KV + Blob or Supabase) and implement abstraction.
- [ ] Font size input for Title and Subtitle.
- [ ] Text tools: fonts, weight, color, alignment, spacing.
- [ ] Save/load design documents per user.
- [ ] Layout presets: add more, reset, auto-layout, auto-fit.
- [ ] Object tools: rotate, align, distribute, snap.
- [x] Remove background: slow process; show loading.
- [ ] Invert B/W: improve quality vs reference.
- [ ] Hi-DPI export presets (2x then downscale) to PNG.
- [x] Size presets: added dimension presets and updated Canvas.
- [ ] Toasts for every user action.
- [ ] Minimal analytics (Vercel Analytics).
- [ ] Media import prototype.
- [ ] Preset templates (Blog, Product, Event, Promo, App Launch).
- [ ] Shareable links (design ID) with view permissions.
- [ ] Batch render from CSV/JSON (programmatic OGs).
- [ ] Theming system + brand kits.

---

More toasts added for export, copy meta, save/load, and errors.
## 18) Error Handling

- `ToastProvider` exposes `useToast` with standard messages for save, export, and errors during background removal or metadata scraping.

---
