# OGGenerator — Base Doc & Roadmap

A concise, implementation‑ready base for the **OG Image Studio** project using **React**, **TailwindCSS**, **Vercel**, and multi‑provider **OAuth**. It covers architecture, environment, providers, and a step‑by‑step roadmap to MVP.

---

## 1) Vision & Scope

OGGenerator is a one‑page (expandable) app to **compose Open Graph images** with live preview and export presets. Users authenticate via mainstream providers and can **upload a logo** and **edit it** (translate, scale, remove background, invert B/W). The result is exportable as PNG and the app can copy a ready‑to‑paste meta‑tag block.

**MVP Goals**

* Authenticated session (Google, GitHub, LinkedIn, Twitter/X, Facebook; *Instagram: see note below*).
* Editor with: title, subtitle, theme (light/dark), layout (left/center), background (color/gradient/image), size presets, and **logo editing** (translate, scale, remove BG, invert B/W).
* Export PNG (1200×630 default; extras 1600×900, 1920×1005) and copy meta tags.
* Basic persistence (local + per‑user cloud).

---

## 2) Tech Stack

* **Framework:** Next.js (React, App Router) — SPA feel + API routes for auth and utilities.
* **Styling:** TailwindCSS + shadcn/ui (optional) for primitives (Toasts, Dialog, Slider).
* **Auth:** NextAuth.js (Auth.js) with OAuth providers (see configuration below).
* **Storage:**

  * Local state: Zustand or React Context.
  * Cloud: Vercel KV/Upstash **or** Supabase (auth‑agnostic) **or** Planetscale/Neon (if SQL preferred).
  * Object storage for uploads (logo): Vercel Blob **or** Supabase Storage/S3‑compatible bucket.
* **Image Processing:** HTMLCanvas + OffscreenCanvas + WebWorker. For **background removal**, use `@imgly/background-removal` (WASM U^2‑Net) or `background-removal` (WASM).
* **Validation/Config:** Zod + TypeScript.
* **Telemetry:** Vercel Analytics (optional: PostHog if desired).
* **Testing:** Vitest + React Testing Library.

---

## 3) Project Structure

```
/ (repo root)
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/[...nextauth]/route.ts          # NextAuth handlers
│  │  │  ├─ upload/route.ts                      # signed upload / server utilities
│  │  │  └─ remove-bg/route.ts                   # optional server-side removal (alt to WASM)
│  │  ├─ (editor)/page.tsx                       # main editor page
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ editor/CanvasStage.tsx
│  │  ├─ editor/ControlsPanel.tsx
│  │  ├─ editor/LogoLayer.tsx
│  │  ├─ ui/* (shadcn/ui exports)
│  │  └─ common/* (Button, Field, Tooltip, Toast)
│  ├─ lib/
│  │  ├─ auth.ts                                  # NextAuth config
│  │  ├─ storage.ts                               # KV/S3 helpers
│  │  ├─ images.ts                                # canvas helpers (scale/export/invert)
│  │  ├─ removeBg.ts                              # WASM loader + pipeline
│  │  ├─ meta.ts                                  # build OG/Twitter meta
│  │  └─ editorStore.ts                           # Zustand store (title, subtitle, theme, etc.)
│  ├─ workers/
│  │  └─ export.worker.ts                         # off-thread PNG export
│  └─ types/
│     └─ index.d.ts
├─ public/
│  └─ fonts/*
├─ .env.local.example
├─ tailwind.config.ts
├─ postcss.config.js
├─ next.config.mjs
├─ package.json
└─ README.md
```

---

## 4) Authentication (NextAuth.js)

**Providers planned:** Google, GitHub, LinkedIn, Twitter/X, Facebook.

> **Instagram note**: Instagram doesn’t provide a standard OAuth flow for *sign‑in* via NextAuth. Practical approach: use **Facebook Login** (Meta) and connect the Instagram account via Instagram Graph/Basic Display API for media access. If sign‑in via Instagram is mandatory, you’ll need a custom provider using Instagram Basic Display (limited, not suitable for secure login). Recommendation: **enable "Connect Instagram"** after login, using Facebook token exchange.

### 4.1 Environment Variables

Create `.env.local` with:

```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=... # openssl rand -base64 32

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
LINKEDIN_ID=...
LINKEDIN_SECRET=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...

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
import LinkedIn from "next-auth/providers/linkedin";
import Twitter from "next-auth/providers/twitter";
import Facebook from "next-auth/providers/facebook";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub, LinkedIn, Twitter, Facebook],
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
* Layout Presets: left/center grid alignment with 8px baseline.
* Logo Layer: PNG/SVG upload (drag‑and‑drop + paste). Controls below.

**Logo Controls**

* **Translate**: click‑drag in canvas; fine‑tune with arrow keys (Shift = 10×).
* **Scale**: pinch/scroll over logo; numeric slider with min/max.
* **Remove Background**: client‑side WASM U^2‑Net; fallback API route.
* **Invert B/W**: canvas filter (luminance threshold + invert) — preview toggle.
* **Mask (Circle)**: optional clipPath for avatars.
* **Reset**: revert layer transforms.

**Export**

* PNG @ 2× downscaled; presets 1200×630 (default), 1600×900, 1920×1005.
* Copy “OG + Twitter meta” block.

**Persistence**

* Local: `localStorage` auto‑save (debounced).
* Cloud: Save per‑user design JSON + uploaded logo URL.

**Accessibility/UX**

* Labels + `aria-describedby` for form fields; focus rings; toasts on success.
* Keyboard: `Ctrl/Cmd+S` export, `Ctrl/Cmd+C` meta, `R` Surprise, `1/2/3` sizes.

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
  layout: "left" | "center";
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

* **Remove BG (client)**: `@imgly/background-removal` or `background-removal` (both WASM). Lazy‑load on demand, run in a WebWorker to avoid jank. Cache last mask.
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
* Sanitize uploaded images (restrict to PNG/SVG; if SVG, sanitize to avoid script injection or rasterize to canvas before use).
* CSRF handled by NextAuth; enforce HTTPS in production.
* Rate‑limit the remove‑BG API route if enabled.

---

## 12) Testing

* Unit: utils (meta builder, image ops) via Vitest.
* Component: ControlsPanel, CanvasStage with React Testing Library + JSDOM.
* E2E: Playwright for auth flow (Google + GitHub at least) and PNG export.

---

## 13) Roadmap

### Sprint 0 — Bootstrap (0.5–1 day)

* [ ] Create Next.js (App Router) + TS + Tailwind skeleton.
* [ ] Install NextAuth + Google & GitHub providers (smoke test).
* [ ] Add shadcn/ui primitives (Button, Slider, Dialog, Toast, Tooltip).

### Sprint 1 — Auth & Storage (1–2 days)

* [ ] Wire LinkedIn, Twitter/X, Facebook providers.
* [ ] Session header (avatar, menu, sign‑out).
* [ ] Choose storage strategy (KV + Blob *or* Supabase) and implement abstraction.
* [ ] Save/load **Design** documents per user.

### Sprint 2 — Editor Core (2–3 days)

* [ ] CanvasStage with background (solid/gradient/image) + presets.
* [ ] Text layers (Title/Subtitle) with clamp + balance.
* [ ] Layout presets (left/center), 8px baseline grid.
* [ ] Local autosave (debounced) and keyboard shortcuts.

### Sprint 3 — Logo Tools (2–3 days)

* [ ] Upload: drag‑and‑drop + paste + URL.
* [ ] Translate + scale + mask (circle) interaction.
* [ ] **Remove Background** via WASM in WebWorker (lazy‑loaded).
* [ ] **Invert B/W** filter + toggle.

### Sprint 4 — Export & Meta (1–2 days)

* [ ] Hi‑DPI export (2× then downscale) to PNG.
* [ ] Size presets (1200×630, 1600×900, 1920×1005).
* [ ] Copy OG/Twitter meta block + toast feedback.

### Sprint 5 — Polish & A11y (1–2 days)

* [ ] Tooltips, focus states, ARIA labels.
* [ ] Toasts for success/failure; error boundaries.
* [ ] Preload font; SVG sanitization; rate‑limit on API routes.
* [ ] Minimal analytics (Vercel Analytics).

### Optional — Instagram Integration (R\&D)

* [ ] Evaluate **Connect Instagram** via Facebook Login token exchange.
* [ ] If needed, custom provider for Instagram Basic Display (not recommended for login).
* [ ] Media import prototype.

---

## 14) Definition of Done (MVP)

* User can sign in with at least **2 providers** (Google + GitHub).
* Editor supports title, subtitle, background, layout, logo translate/scale, remove BG, invert B/W.
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
* **Fonts not applied in export**: use `document.fonts.ready` and/or pre‑rasterize text.
* **WASM background removal slow**: run in Worker and lazy‑load the model (\~5–15MB). Cache after first run.
* **SVG injection risk**: sanitize or rasterize into canvas before any edit.

---

**End of base doc.**
