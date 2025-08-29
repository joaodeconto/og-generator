# OG Image Generator
Create polished Open Graph images in minutes. Friendly, fast, and predictable — with keyboard controls and precise dragging.

## What You Can Do
- Create social preview images for blogs, docs, products, and announcements.
- Drag your logo, edit title/subtitle, and clamp precisely to the canvas.
- Remove a logo background, invert colors, or apply a circular mask.
- Export crisp PNGs in multiple sizes. Copy OG/Twitter meta tags.
- Undo/redo safely — each drag counts as a single undo action.

## Create Your First Image
1) Sign in: use Google or GitHub from the top-right menu.
2) Add content: set Title and Subtitle; pick a canvas size.
3) Add a logo: upload or pick an existing one; drag to position.
4) Refine: use Background Remove, Invert, or Mask; pick a background color.
5) Nudge precisely: use arrow keys (hold Shift to move faster). Shift+Up/Down scales the logo.
6) Export: click Export → choose size; or Copy Meta to paste into your site.

Tips
- Dragging is precise and predictable; movement is clamped to the canvas edge.
- Keyboard parity: every drag can be done with arrows; each drag = one undo.
- Fonts are loaded before export to prevent blurry text.

## Features
- [x] Auth with Google and GitHub (NextAuth)
- [x] Persistent avatar and session menu
- [ ] Additional providers (Twitter, Facebook, Instagram)
- [x] Canvas editor: title, subtitle, draggable logo (edge clamping; no unintended resize while moving)
- [x] Background removal, B/W invert, circular mask (with loading state)
- [x] Undo/redo history (single undo entry per drag)
- [ ] Logo upload via drag-and-drop
- [x] PNG export in multiple sizes (font readiness guarded)
- [x] Toasts for save, export, and errors
- [x] Custom background color
- [x] Copy OG/Twitter meta tags with toast feedback
- [ ] Preset layouts and color themes (planned)
- [x] Editor state persistence API (CRUD)
- [x] Canvas dimension presets
- [x] Tooltips for toolbar buttons
- [ ] Canvas Tools: text (fonts, colors, sizes) and objects (scale, rotate, align) — in progress

### Keyboard Shortcuts
- Cmd/Ctrl+Z: undo
- Cmd/Ctrl+Shift+Z: redo
- Cmd/Ctrl+C: copy meta tags
- Cmd/Ctrl+S: save
- Arrows: move logo (Shift modifies step)
- Shift+Up/Down: change logo scale

## How It Works
- Stack: Next.js 15 (App Router) + React 18, Tailwind CSS, Zustand
- Auth via NextAuth; image background removal via WebWorker + WASM model
- Export powered by `html-to-image` with document fonts readiness guard
- External images proxied through `/api/image` to avoid CORS issues

Dragging is a critical feature: precise, predictable, keyboard parity, and one undo per drag. Transform order is `scale()` then `translate()` to avoid visual distortion, and canvas-edge clamping is symmetric.

## Quickstart
- Requirements: Node.js 18+ and pnpm
- Local dev:
  - `pnpm install`
  - `cp .env.example .env.local` (fill in credentials)
  - `pnpm dev` then open http://localhost:3000

## Fast Commands
- `pnpm agent`: lint + tests (with coverage) + docs guard
- `pnpm docs:log`: append a daily log stub from last commit message
- `pnpm docs:guard`: ensure code diffs are accompanied by docs/log updates and README env vars
- `pnpm test`: run Jest with coverage
- `pnpm lint`: run ESLint

## Env Vars
Copy `.env.example` to `.env.local` and fill credentials. Variables are validated at runtime by `lib/env.ts` (Zod). If `NEXTAUTH_SECRET` is not provided, a default `dev-secret` is used for development only.

Required/optional keys (documented by docs guard):
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`, `GITHUB_SECRET`
- `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET` (optional)
- `TWITTER_CONSUMER_KEY`, `TWITTER_CONSUMER_SECRET` (optional, legacy)
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` (optional)
- `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET` (optional)

Minimal example:

```env
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Documentation
- Architecture and specs: `docs/dev_doc.md`
- Decision log: `docs/log/`

## Testing
Run unit and component tests and verify docs are in sync:

```bash
pnpm lint       # ESLint
pnpm test       # Jest with coverage
pnpm docs:guard # guard README/dev_doc/log and env var docs
```

Tests live in `__tests__/` and cover utilities, editor flows, drag/clamp behavior, and API routes.

Coverage policy:
- Global: ≥ 80% lines and ≥ 80% branches (see `jest.config.ts`)
- Critical utils target 90%+ (per-file thresholds ratcheted)

## Known Issues
- Some sites block metadata scraping; the Metadata panel shows a toast on failure
- Some hosts may block the `/api/image` proxy, impacting background removal

## License
MIT — see `LICENSE` for details.

