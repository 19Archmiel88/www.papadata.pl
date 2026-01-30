# Test Log

Format:

- Date (YYYY-MM-DD)
- Scope (what was tested)
- Command
- Result (pass/fail)
- Notes (optional)

---

## 2026-01-11

- Scope: Playwright E2E (landing + dashboard demo)
- Command: `pnpm run e2e` (cwd: `apps/web`)
- Result: fail
- Notes: Vite entry points to `/src/main.tsx`, file not found (app entry is `index.tsx`).

## 2026-01-11 (run 2)

- Scope: Playwright E2E (landing + dashboard demo)
- Command: `pnpm run e2e` (cwd: `apps/web`)
- Result: fail
- Notes: `/dashboard/overview` routes to landing due to HashRouter, test updated to use `/#/dashboard/overview`.

## 2026-01-11 (run 3)

- Scope: Playwright E2E (landing + dashboard demo)
- Command: `pnpm run e2e` (cwd: `apps/web`)
- Result: pass
- Notes: ok

## 2026-01-11 (run 4)

- Scope: Playwright E2E (landing + dashboard demo + navigation)
- Command: `pnpm run e2e` (cwd: `apps/web`)
- Result: pass (warning)
- Notes: HTML reporter folder clash with test results; moved report to `playwright-report`.

## 2026-01-11 (run 5)

- Scope: Playwright E2E (landing + dashboard demo + navigation)
- Command: `pnpm run e2e` (cwd: `apps/web`)
- Result: pass
- Notes: ok

## 2026-01-11 (run 6)

- Scope: Playwright E2E (landing + dashboard demo + navigation + integrations/settings)
- Command: `pnpm run e2e` (cwd: `apps/web`)
- Result: pass
- Notes: added integrations/settings smoke test

## 2026-01-11 (run 7)

- Scope: Playwright E2E (dashboard clickables + demo locks)
- Command: `pnpm run e2e -- --workers=1` (cwd: `apps/web`)
- Result: pass
- Notes: parallel run with default workers had timeouts; serial run is stable.
