# agent\_docs.md — Docs & QA Agent for OGGenerator

> Purpose: Keep **documentation in lockstep with code**. This agent writes concise change logs, updates the developer doc, refreshes the README with instructions/TODOs, and ensures **tests** exist (and pass) for every feature. It also enforces these rules in CI.

---

## 0) Mission & Scope

* **Document main changes** in `docs/log/` per PR/merge.
* **Update** `docs/dev_doc.md` whenever decisions or implementations land.
* **Refresh README.md** with install/run instructions, TODOs, and usage details.
* Ensure **tests** are present: unit, component, and e2e.
* Provide **automation** (scripts + CI) so missing docs/tests fail the build.

---

## 1) Repository Docs Topology

```
docs/
  dev_doc.md          # Source of truth for architecture & roadmap (kept updated)
  log/
    YYYY-MM-DD.md     # Daily/PR-scope log entries (agent appends)
  adr/
    0001-<title>.md   # Architecture Decision Records (MADR format)
CHANGELOG.md          # Versioned summaries (optional; generated on release)
README.md             # Quickstart, UX, features, status, testing & CLI
```

**MADR template (short):**

```
# <Decision Title>
Date: YYYY-MM-DD
Status: accepted | rejected | superseded-by <id>
Context: <why>
Decision: <what>
Consequences: <trade-offs>
Links: <PRs, issues>
```

---

## 2) Event Triggers & Workflow

**When to act**

* On **PR open/sync** with changes in `src/**`, `lib/**`, `state/**`, `workers/**`, the agent:

  1. Generates/updates `docs/log/YYYY-MM-DD.md` with a **change summary**.
  2. Patches `docs/dev_doc.md` if specs/architecture changed.
  3. Verifies `README.md` sections are current.
  4. Checks that tests exist & run for touched areas.
* On **merge to main**, the agent appends to `docs/log/YYYY-MM-DD.md` and, if a tag is cut, rolls changes into `CHANGELOG.md`.

**Guardrails (CI hard-fail if):**

* Code changes without matching docs/log update.
* Features modified/added without tests or with coverage below threshold.
* README missing updated commands or env vars referenced in code.

---

## 3) README Ownership — Required Sections

The agent ensures these always exist and are fresh:

1. **Quickstart** (install, env, dev server)
2. **Features** (checkboxes; match current status)
3. **How it works** (editor layout, canvas, logo tools)
4. **Keyboard Shortcuts**
5. **Env Vars** (NextAuth + storage)
6. **Testing** (commands + structure)
7. **Roadmap & Status** (mirrors `docs/dev_doc.md` MVP checklist)
8. **Known Issues** (from `docs/log/` and CI)

> The agent adds a **TODO banner** near the top when the project is mid‑migration.

---

## 4) Checklists (Live)

### 4.1 Current Flaws (must fix before MVP)

* [ ] Missing **Zustand** state wiring between `Inspector` and `CanvasStage`.
* [x] No **remove‑BG** WebWorker integration (WASM lazy-load + cache).
* [ ] **SVG sanitization** or rasterization path not implemented.
* [ ] **Export @2x** pipeline lacks font preload/`document.fonts.ready` guard.
* [ ] **A11y**: ensure labels/ARIA on all controls; keyboard move/scale.
* [ ] **Error toasts** and error boundaries for image ops.
* [ ] **Meta copy** action not wired to builder util.
* [ ] **CI** missing docs guard & coverage threshold.

### 4.2 Future Development (post‑MVP)

* [ ] Preset templates (Blog/Product/Event/Promo/App Launch).
* [ ] Shareable links & permissions.
* [ ] Team spaces (if Supabase/SQL).
* [ ] Batch render from CSV/JSON.
* [ ] Brand kits & theming system.

> The agent promotes items from the dev doc roadmap into these lists and keeps them synced.

---

## 5) Test Plan & Coverage Matrix

**Test stacks**

* **Unit**: Vitest (utils in `lib/images.ts`, `lib/meta.ts`, `state` actions)
* **Component**: React Testing Library + JSDOM (`CanvasStage`, `Inspector`, panels)
* **E2E**: Playwright (auth flow, export PNG, meta copy)

**Coverage targets**

* Global **80% lines**, **80% branches**; critical utils 90%+.

**Matrix**

| Area                                       | Unit          | Component | E2E |
| ------------------------------------------ | ------------- | --------- | --- |
| Meta builder (`lib/meta.ts`)               | ✅             | —         | —   |
| Image ops (`lib/images.ts`) invert/scale   | ✅             | —         | —   |
| Remove BG orchestrator (`lib/removeBg.ts`) | ✅ (mock WASM) | —         | —   |
| Editor store (`state/editorStore.ts`)      | ✅             | —         | —   |
| CanvasStage render & resize                | —             | ✅         | —   |
| Inspector tabs & controls                  | —             | ✅         | —   |
| Auth (NextAuth Google/GitHub)              | —             | —         | ✅   |
| Export (PNG sizes + download)              | —             | —         | ✅   |
| Meta copy (clipboard)                      | —             | —         | ✅   |

---

## 6) CI: Docs & Tests Enforcement

**.github/workflows/ci.yml (snippet)**

```yml
name: CI
on:
  pull_request:
    paths: [ 'src/**', 'lib/**', 'state/**', 'workers/**', 'docs/**', 'README.md' ]
  push:
    branches: [ main ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm i --frozen-lockfile=false
      - run: pnpm typecheck && pnpm lint
      - run: pnpm test -- --coverage --run
      - name: Docs guard
        run: pnpm docs:guard
```

**scripts/docs-guard.ts (pseudo)**

```ts
import { execSync } from 'node:child_process';
const diff = execSync('git diff --name-only origin/${{ github.base_ref }}').toString().split('\n');
const codeTouched = diff.some(p => /^(src|lib|state|workers)\//.test(p));
const docsTouched = diff.some(p => /^docs\/log\//.test(p)) || diff.includes('docs/dev_doc.md') || diff.includes('README.md');
if (codeTouched && !docsTouched) {
  console.error('Docs guard: Code changed but docs/log or dev_doc/README not updated.');
  process.exit(1);
}
```

**package.json (scripts)**

```json
{
  "scripts": {
    "docs:log": "tsx scripts/docs-log.ts",
    "docs:guard": "tsx scripts/docs-guard.ts",
    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

**scripts/docs-log.ts (skeleton)**

```ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
const date = new Date().toISOString().slice(0,10);
mkdirSync(`docs/log`, { recursive: true });
const summary = execSync('git log -1 --pretty=%B').toString().trim();
const body = `# ${date}\n\n## Summary\n- ${summary}\n\n## Changed\n- (auto-fill from PR description or commits)\n`;
writeFileSync(`docs/log/${date}.md`, body, { flag: 'a' });
```

---

## 7) README — sections the agent maintains

* **Quickstart**
* **Environment** (`.env.local` template)
* **Running Locally** (`pnpm dev`)
* **Testing** (`vitest`, `playwright`)
* **Keyboard Shortcuts**
* **Roadmap/MVP checklist** (synced from `docs/dev_doc.md`)
* **Known Issues**
* **Changelog / Links**

> The agent edits the README in place and adds a `<!-- auto:docs -->` anchor so manual content above/below remains intact.

---

## 8) Sync Rules with `docs/dev_doc.md`

* Reflect **new decisions** (e.g., storage choice, auth providers) by updating relevant sections.
* When UI layout evolves (e.g., Inspector tabs), update **Editor — Functional Spec**.
* Keep **Roadmap** checkboxes in sync with issue tracker & PR merges.

---

## 9) PR Template (enforced)

```
## Summary
Describe the change in 1–3 sentences.

## Screenshots/GIF
(If UI)

## Docs Updated
- [ ] docs/log/YYYY-MM-DD.md
- [ ] docs/dev_doc.md
- [ ] README.md

## Tests
- [ ] Unit
- [ ] Component
- [ ] E2E

## Checklist
- [ ] A11y considered
- [ ] Fallbacks & errors handled
- [ ] Env vars documented (if any)
```

---

## 10) Today’s Seed Log Template

When you run `pnpm docs:log` on **first adoption**, write:

```
# YYYY-MM-DD

## Summary
Adopted Docs & QA Agent: enabled docs guard, added test plan, and README ownership.

## Changed
- Added CI job for docs/tests enforcement
- Added scripts/docs-guard.ts & scripts/docs-log.ts
- Populated checklists for current flaws and future development
```

---

## 11) Definition of Done

* Every PR that touches code also touches docs/log **or** justifies no-docs in template.
* `docs/dev_doc.md` mirrors real architecture & UX at all times.
* README contains working Quickstart, Testing, and Roadmap.
* Tests exist & pass for updated features; coverage ≥ target.
* CI blocks merges when expectations are not met.
