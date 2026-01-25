# Dependency Upgrades — plan i źródła ostrzeżeń

## DEP0040 (punycode) — źródło
Źródło warningu podczas `pnpm run test:api:e2e`:
- `@google-cloud/vertexai` i `firebase-admin`
  - `google-auth-library`
    - `gaxios`
      - `node-fetch@2.7.0`
        - `whatwg-url@5.0.0`
          - `tr46@0.0.3` → `require("punycode")` (deprecated w Node)

Weryfikacja: `pnpm --filter @papadata/api why tr46`.

Plan:
1) Monitorować release’y `google-auth-library` / `gaxios` pod kątem przejścia na `node-fetch@3` lub `undici`.
2) Zaktualizować `@google-cloud/vertexai` i `firebase-admin` po pojawieniu się kompatybilnej wersji.
3) Unikać override na `node-fetch@3` bez testów (ESM breaking change).

## Przestarzałe zależności z raportu pnpm

### Root
- `eslint@8.57.1` usunięty z root (linty są utrzymywane w workspace’ach).

### apps/api
- `eslint@8.x` pozostaje do czasu migracji configu do ESLint 9 (flat config).
- `supertest@6.3.4` i `superagent@8.1.x` — potencjalny bump po weryfikacji kompatybilności testów.

Plan migracji ESLint:
1) Przenieść konfigurację z `.eslintrc` do flat config.
2) Zaktualizować `@typescript-eslint/*` do wersji wspierającej ESLint 9.
3) Podnieść `eslint` do 9.x i zweryfikować lint w CI.

### Transitive (glob/inflight/rimraf)
- Występują jako zależności pośrednie w narzędziach. Wymagają upgrade upstream (np. nowsze wersje narzędzi).
- Plan: zidentyfikować właściciela (`pnpm why`) i zaplanować bump zależności nadrzędnej.
