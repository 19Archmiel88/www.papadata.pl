
---

### `docs/engineering/security.md` :contentReference[oaicite:4]{index=4}

```md
# Engineering — Security baseline (Production + Public Demo 1:1)

Ten dokument opisuje minimalny baseline bezpieczeństwa dla komercyjnego SaaS oraz publicznego trybu DEMO.

Powiązane:
- Security policy (zgłaszanie podatności): `../../SECURITY.md`
- Incident response: `../operations/incident-response.md`
- Deploy (headers/CSP): `deploy.md`
- AI integration (proxy/rate limits): `ai-integration.md`
- Privacy & data: `../compliance/privacy-and-data.md`

---

## 1) Dane wrażliwe i PII
Zasady:
- Nie umieszczaj w promptach AI:
  - haseł, kluczy API, tokenów, sekretów webhooków,
  - danych szczególnych (RODO).
- W DEMO: nie loguj danych użytkownika w konsoli ani w telemetryce.
- W PROD: logi muszą być wolne od PII; logujemy tylko metadane (requestId, czas, status). Retencja logów aplikacyjnych: 30 dni.

---

## 2) Klucze i sekrety
- Sekrety tylko po stronie serwera (Secret Manager / KMS) — **nigdy w frontendzie**.
- `.env.local` tylko lokalnie; repo zawiera `.env.example` bez sekretów.
- Integracje:
  - `client_secret`, `refresh_token`, `api_key`, `signing_secret` → storage szyfrowany po stronie backendu.

---

## 3) Public DEMO — ryzyka i zabezpieczenia (wymagane)
DEMO jest publiczne, więc wymagane:
- rate limiting (AI i `/api/*`),
- bot/abuse protection: Cloud Armor (policy `papadata-security-policy`) w środowiskach publicznych,
- brak operacji z trwałymi skutkami (billing, invite, connect real) — tylko symulacje,
- wyraźne oznaczenie „Demo mode” w UI,
- kill switch do wyłączenia AI w DEMO: `AI_ENABLED_DEMO=false`.

---

## 4) AI security
- Wywołania do Gemini/Vertex tylko przez backend proxy (klucz jako sekret).
- Obsługa safety blocks z czytelnym komunikatem (bez ujawniania reguł filtrów).
- Walidacja wejścia w DEMO: blokada PII/sekretów (regexy na email/tokeny/numery kart) w [apps/api/src/modules/ai/ai.service.ts](../../apps/api/src/modules/ai/ai.service.ts#L74-L126).
- Ochrona przed prompt injection:
  - nie wstrzykuj do promptu niezweryfikowanych treści użytkownika jako “system/dev”,
  - brak RAG w obecnej implementacji; kontekst pochodzi wyłącznie z payloadu UI.

---

## 5) Frontend security (baseline)
- CSP i security headers: obowiązuje baseline z `deploy.md` (allowlist dla Sentry i assetów statycznych).
- Zabezpieczenia XSS:
  - unikaj `dangerouslySetInnerHTML` bez sanitizacji,
  - odpowiedzi AI są renderowane jako tekst (bez `dangerouslySetInnerHTML`), więc nie wymagają sanitizacji HTML.
- Ogranicz uprawnienia browser APIs (Permissions-Policy) do potrzeb.

---

## 6) Auth / RBAC / SSO (produkcyjny wymóg)
W produkcji obowiązuje:
- Auth: email login/register + magic link (backend endpoints w `apps/api/src/modules/auth`).
- SSO: OAuth start endpoint jest stubem w DEMO, a w PROD wymaga dostawców OAuth (konfiguracja poza repo).
- RBAC: role pochodzą z tokenu (`papadata_user_roles` w localStorage) i są wymagane do dostępu do danych.
- AI respektuje uprawnienia przez backend (tenant-scoped context).

---

## 7) Supply chain i podatności
- pinowanie zależności przez lockfile,
- skan podatności: `pnpm audit` przed release (minimum) oraz kwartalny przegląd zależności,
- proces aktualizacji zależności: miesięczny przegląd + krytyczne CVE w 48h.

---

## 8) Incident handling
Zobacz: `../operations/incident-response.md` oraz `../../SECURITY.md`.
