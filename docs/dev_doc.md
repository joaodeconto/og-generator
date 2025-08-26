# OGGenerator — Base Doc & Roadmap

A concise, implementation‑ready base for the **OG Image Studio** project using **React**, **TailwindCSS**, **Vercel**, and multi‑provider **OAuth**. It covers architecture, environment, providers, and a step‑by‑step roadmap to MVP.

---

## 1) Vision & Scope

OGGenerator is a one‑page (expandable) app to **compose Open Graph images** with live preview and export presets. Users authenticate via mainstream providers and can **upload a logo** and **edit it** (translate, scale, remove background, invert B/W). The result is exportable as PNG and the app can copy a ready‑to‑paste meta‑tag block.

**MVP Goals**

* Authenticated session via Google and GitHub. Twitter/X and Facebook are optional.
* Editor with: title, subtitle, theme (light/dark), layout (left/center/right, vertical top/center/bottom), background (color/gradient/image), size presets, and **logo editing** (upload via file/paste/URL, translate, scale, remove BG, invert B/W, mask).
* Export PNG (1200×630 default; extras 1600×900, 1920×1005) and copy meta tags.
* Basic persistence (local + per‑user cloud).

---

## 2) Tech Stack

* **Framework:** Next.js (React, App Router) — SPA feel + API routes for auth and utilities.
* **Styling:** TailwindCSS + shadcn/ui (optional) for primitives (Toasts, Dialog, Slider).
* **Auth:** NextAuth.js (Auth.js) with OAuth providers (see configuration below).
* **Storage:**

  * Local state: Zustand with undo/redo history and localStorage persistence.
  * Cloud: Vercel KV/Upstash **or** Supabase (auth‑agnostic) **or** Planetscale/Neon (if SQL preferred).
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
│  └─ removeBg.ts                              # WASM loader + pipeline
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
```

### Inspector Tabs

The editor's right-hand inspector groups controls into individual panels. Tabs are now available for **Canvas**, **Text**, **Logo**, **Metadata**, **Presets**, and **Export**, each rendering its respective `*Panel` component. The Metadata tab fetches page information via `/api/scrape` and shows a toast warning if the request fails.

---

## 4) Authentication (NextAuth.js)

**Providers planned:** Google and GitHub by default. Twitter/X and Facebook are optional.

> **Instagram note**: Instagram doesn’t provide a standard OAuth flow for *sign‑in* via NextAuth. Practical approach: use **Facebook Login** (Meta) and connect the Instagram account via Instagram Graph/Basic Display API for media access. If sign‑in via Instagram is mandatory, you’ll need a custom provider using Instagram Basic Display (limited, not suitable for secure login). Recommendation: **enable "Connect Instagram"** after login, using Facebook token exchange.

### 4.1 Environment Variables

Create `.env.local` with:

```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=... # openssl rand -base64 32 (fallback dev-secret if unset)

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
TWITTER_CLIENT_ID=... # opcional
TWITTER_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=... # opcional
FACEBOOK_CLIENT_SECRET=...

# (Os blocos acima são opcionais; remova‑os se não for habilitar esses provedores.)

# Storage options (pick one strategy)
VERCEL_BLOB_READ_WRITE_TOKEN=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
S3_ENDPOINT=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=...
```

### 4.2 NextAuth Snippet (TypeScript)

```ts
// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Facebook from "next-auth/providers/facebook";
import { env } from "./env";

const providers: any[] = [];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
  providers.push(Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }));

if (env.GITHUB_ID && env.GITHUB_SECRET)
  providers.push(GitHub({ clientId: env.GITHUB_ID, clientSecret: env.GITHUB_SECRET }));

if (env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET)
  providers.push(Twitter({ clientId: env.TWITTER_CLIENT_ID, clientSecret: env.TWITTER_CLIENT_SECRET }));

if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET)
  providers.push(Facebook({ clientId: env.FACEBOOK_CLIENT_ID, clientSecret: env.FACEBOOK_CLIENT_SECRET }));

export const { handlers, auth } = NextAuth({
  providers,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) (session as any).userId = token.sub;
      return session;
    },
  },
});
```

```ts
// src/app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from "@/lib/auth";
```

### 4.3 OAuth Redirect URLs (Vercel)

Set each provider’s **Authorized redirect URI** to:

```
https://<your-vercel-domain>/api/auth/callback/<provider>
```

Local dev:

```
http://localhost:3000/api/auth/callback/<provider>
```

---

## 5) Editor — Functional Spec

**Canvas Stage**

* Base size (1200×630). Zoom to fit viewport, render at 2× for crisp export.
* Background: solid/gradient/image (with object‑fit cover, position).
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
* **Position Presets & Undo/Redo**: quick corner/center placement plus history controls.
* **Reset**: revert layer transforms.

**Export**

* PNG @ 2× downscaled; presets 1200×630 (default), 1600×900, 1920×1005.
* Copy “OG + Twitter meta” block.
* Canvas images flagged with `crossOrigin="anonymous"`; remote hosts must permit CORS for export.

**Persistence**

* Local: `localStorage` auto‑save (debounced).
* Cloud: Save per‑user design JSON + uploaded logo URL.

**Accessibility/UX**

* Labels + `aria-describedby` for form fields; focus rings; toasts on success.
* Keyboard: `Ctrl/Cmd+S` export, `Ctrl/Cmd+C` meta, `R` Surprise, `1/2/3` sizes, arrow keys move logo, `Shift+Arrow` scales logo.

---

## 6) Data Model (minimal)

```ts
// Design JSON stored per user
export type Design = {
  id: string;              // uuid
  ownerId: string;         // session userId
  title: string;
  subtitle: string;
  theme: "light" | "dark";
  layout: "left" | "center" | "right";
  vertical: "top" | "center" | "bottom";
  bg: { kind: "solid"|"gradient"|"image"; value: any };
  size: { w: number; h: number };
  logo?: {
    url: string; x: number; y: number; scale: number; mask: "none"|"circle";
    ops: { removedBg?: boolean; inverted?: boolean };
  };
  updatedAt: string;
};
```

---

## 7) Storage Strategy (choose)

* **Vercel Blob**: simplest for user uploads (logo).
* **KV (Upstash)**: fast JSON state (design documents).
* **Supabase**: both auth‑agnostic DB + Storage; great if we may expand to multi‑user galleries and sharing.

**Abstraction**: implement `saveDesign(design)`, `getDesign(id)`, `listDesigns(userId)` so backend swap is painless.

---

## 8) Image Processing Details

* **Remove BG (client)**: WebWorker lazy-loads `@imgly/background-removal` and caches the WASM model.
* **Invert B/W**: convert to grayscale (luma = 0.299R + 0.587G + 0.114B), then `255 - luma` or threshold to produce stencil.
* **Hi‑DPI Export**: render @ 2× (or 3× for 4k), then scale down to target; embed font (or pre‑rasterize text) to avoid FOUT.

---

## 9) Meta Tags Builder

```ts
export function buildOgMeta({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
  return `
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OG Image Studio">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">`.trim();
}
```

---

## 10) Dev & Build Setup

**Install**

```
pnpm i
pnpm dlx shadcn-ui@latest init   # optional UI kit
pnpm dev
```

**Tailwind**

* Install Tailwind, add `@tailwind base; @tailwind components; @tailwind utilities;` to `globals.css`.
* Configure content paths to `src/**/*.{ts,tsx}`.

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

## 13) Roadmap

### Sprint 0 — Bootstrap (0.5–1 day)

* [x] Create Next.js (App Router) + TS + Tailwind skeleton.
* [x] Install NextAuth + Google & GitHub providers (smoke test).
* [ ] Add shadcn/ui primitives (Button, Slider, Dialog, Toast, Tooltip).

### Sprint 1 — Auth & Storage (1–2 days)

* [x] Wire Twitter/X and Facebook providers (see `lib/auth.ts`).
* [ ] Session header: AuthButtons handles sign-in/out; avatar + menu pending.
* [ ] Choose storage strategy (KV + Blob *or* Supabase) and implement abstraction.
* [ ] Save/load **Design** documents per user.

### Sprint 2 — Editor Core (2–3 days)

* [x] CanvasStage wired to editor store with banner, title/subtitle and logo processing.
* [ ] Text layers (Title/Subtitle) with clamp + balance (basic inputs exist).
* [x] Layout presets (left/center); 8px baseline grid pending.
* [x] Local autosave (Zustand persist) and basic keyboard shortcuts for logo.

### Sprint 3 — Logo Tools (2–3 days)

* [ ] Upload: file input, paste and URL handled; drag‑and‑drop pending.
* [x] Translate + scale + mask (circle) — drag to translate logo and arrow keys for fine-tuning.
* [x] **Remove Background** via WASM in WebWorker (toggle integrated with helper).
* [x] **Invert B/W** filter + toggle.

### Sprint 4 — Export & Meta (1–2 days)

* [ ] Hi‑DPI export (2× then downscale) to PNG.
* [x] Size presets (1200×630, 1600×900, 1920×1005).
* [x] Copy OG/Twitter meta block with toast feedback.

### Sprint 5 — Polish & A11y (1–2 days)

* [ ] Tooltips and polished focus states; basic ARIA labels present.
* [x] Toasts for success/failure; error boundaries.
* [ ] Preload font and rate‑limit API routes (SVG sanitization wired).
* [ ] Minimal analytics (Vercel Analytics).

### Optional — Instagram Integration (R\&D)

* [ ] Evaluate **Connect Instagram** via Facebook Login token exchange.
* [ ] If needed, custom provider for Instagram Basic Display (not recommended for login).
* [ ] Media import prototype.

---

## 14) Definition of Done (MVP)

* User can sign in with at least **2 providers** (Google + GitHub).
* Editor supports title, subtitle, background, layout & vertical alignment, logo translate/scale, remove BG, invert B/W.
* PNG export works for 1200×630; other sizes optional.
* Meta block copies to clipboard.
* State persists locally and user can save/load at least one **Design** in cloud.

---

## 15) Nice‑to‑Haves (Post‑MVP)

* Preset templates (Blog, Product, Event, Promo, App Launch).
* Shareable links (design ID) with view permissions.
* Team spaces (multi‑user) if Supabase/SQL chosen.
* Batch render from CSV/JSON (programmatic OGs).
* Theming system + brand kits.

---

## 16) Commands & Scripts

```
# Dev
pnpm dev

# Typecheck & Lint
pnpm typecheck
pnpm lint

# Unit tests
pnpm test

# Build (CI/Vercel)
pnpm build
```

---

## 17) Troubleshooting

* **OAuth callback error**: ensure provider console has the exact redirect URL.
* **Fonts not applied in export**: the export utility awaits `document.fonts.ready`, but ensure custom fonts are loaded.
* **Exported image cropped**: export uses `clientWidth`/`clientHeight` to ignore preview zoom. Verify these reflect the expected base size.
* **WASM background removal slow**: run in Worker and lazy‑load the model (\~5–15MB). Cache after first run.
* **SVG injection risk**: sanitize or rasterize into canvas before any edit.

---

## 18) Error Handling

* `ErrorBoundary` envolve o `EditorShell` exibindo um fallback amigável.
* `ToastProvider` fornece notificações para falhas em remoção de fundo, exportação e busca de metadata.

---

**End of base doc.**

