# agent\_docs.md — Docs & QA Agent for OGGenerator

> Purpose: Keep **documentation in lockstep with code**. This agent writes concise change logs, updates the developer doc, refreshes the README with instructions/TODOs, and ensures **tests** exist (and pass) for every feature. It also enforces these rules in CI. Plan, execute, implement and Fix features. 

---

## 0) Mission & Scope

* Read documentation. 
* **Update** `docs/dev_doc.md` whenever decisions or implementations land.
* **Refresh README.md** with install/run instructions, TODOs, and usage details.
* Ensure **tests** are present: unit, component, and e2e.
* Provide **automation** (scripts + CI) so missing docs/tests fail the build.
* Fix bugs and inconsistencies
* Suggest improvements

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

  - Patches `docs/dev_doc.md` if specs/architecture changed.
  - Verifies `README.md` sections are current.

**Guardrails (CI hard-fail if):**

- Code changes without matching docs/log update.
- Features modified/added without tests or with coverage below threshold.
- README missing updated commands or env vars referenced in code.

---

## 3) README Ownership — Required Sections

The agent ensures these always exist and are fresh:

1. **Quickstart** (install, env, dev server)
2. **Features** (checkboxes; match current status)
3. **How it works**
5. **Env Vars** (NextAuth + storage)
6. **Testing** (commands + structure)
7. **Roadmap & Status** (mirrors `docs/dev_doc.md` MVP checklist)
8. **Known Issues** (from `docs/log/` and CI)

> The agent adds a **TODO banner** near the top when the project is mid‑migration.

---

### 4.2 Future Development (post‑MVP)

* [ ] Shareable links & permissions.
* [ ] Brand kits & theming system.

## 5) Test Plan & Coverage Matrix

**Coverage targets**

* Global **80% lines**, **80% branches**; critical utils 90%+.

## 11) Definition of Done

* Tests exist & pass for updated features; coverage ≥ target.
