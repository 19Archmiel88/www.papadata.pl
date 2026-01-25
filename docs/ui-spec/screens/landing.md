# Landing — landing

## Cel i kontekst
- Publiczny landing dla DEMO/PROD (identyczny UI), buduje popyt i prowadzi do rejestracji/demo.
- Użytkownicy: niezalogowani (prospects), powracający, trial.

## Wejścia / Preconditions
- Wejście z route’ów: /, /features, /pricing, /integrations, /faq.
- Brak wymagań auth.
- Dane/copy z i18n: `translations.ts` (t.hero, t.featuresSection, t.pricing, t.faq, t.integrations, t.security, t.roi).
- Cookie consent może być nieustawiony (localStorage `cookie_consent`).

## Układ (Figma-ready)
### Struktura
- Header (MainLayout): logo + nav + CTA + login.
- Tla: `AuroraBackground` + `NeuralBackground` (fixed).
- Hero + CTA (primary/secondary) + badges.
- Vertex Player (lazy; tylko desktop).
- ROI Calculator.
- Integrations marquee.
- Features grid.
- Integrations grid + CTA do katalogu.
- Security section + CTA.
- Pricing cards + billing toggle + compare.
- FAQ accordion.
- Cookie banner overlay.
- Promo modal (timer po consent) + teaser button (CTA -> auth).
- Dock czatu: `LandingChatWidget`.
- Footer (MainLayout).

### Komponenty
- Buttony: `InteractiveButton` (primary/secondary) + przyciski menu.
- Inputy: brak (poza modalami).
- Inne: `VertexPlayer`, `CookieBanner`, `PromoModal`, `LandingChatWidget`, `AuroraBackground`, `NeuralBackground`.

### Copy (teksty UI)
- Wszystkie teksty z i18n: `t.hero.*`, `t.featuresSection.*`, `t.integrations.*`, `t.security.*`, `t.pricing.*`, `t.faq.*`, `t.roi.*`.

### RWD
- Desktop: hero + player (2 kolumny).
- Tablet/Mobile: player ukryty, sekcje w 1 kolumnie.

## Stany UI
- Default: wszystkie sekcje renderowane, część lazy.
- Loading: LazySection/Suspense fallback (szare skeletony) dla Integrations/Security/Pricing/FAQ/Vertex.
- Empty: n/a (copy zawsze z i18n).
- Error: n/a (brak fetch).
- Success: n/a.
- Disabled/Readonly: CTA w pricing enterprise otwiera mailto.
- Skeleton: tak, w lazy wrapper.
- Focus/Keyboard: CTA i nawigacja dostępne z klawiatury.

## Interakcje (klik po kliku)
### Akcja: CTA „Trial” w Hero
- Trigger: klik `InteractiveButton` primary.
- Warunki: brak.
- Efekt UI: otwiera modal auth (register).
- Side effects: `openModal('auth', { isRegistered: false })`.
- Błędy: brak.
- Telemetria: brak jawnej.

### Akcja: CTA „Video” w Hero
- Trigger: klik secondary.
- Efekt UI: otwiera modal video.
- Side effects: `openModal('video')`.

### Akcja: CTA w Pricing (Starter/Professional)
- Trigger: klik `plan.cta`.
- Efekt: gdy niezalogowany -> otwiera modal auth (register); gdy zalogowany -> start checkout.
- Side effects:
  - niezalogowany: `openModal('auth', { isRegistered: false })` + zapis wybranego planu do localStorage.
  - zalogowany: `createCheckoutSession({ tenantId, planId })` i redirect na `url`.
- Błędy: brak tenantId -> komunikat o błędzie + CTA do `/app/settings/workspace`.

### Akcja: CTA w Pricing (Enterprise)
- Trigger: klik `plan.cta`.
- Efekt: przejście do mailto.
- Side effects: `window.location.href = mailto:hello@papadata.ai...`.

### Akcja: Compare pricing
- Trigger: link `pricing.compare_btn`.
- Efekt: otwiera `PricingModal`.
- Side effects: `openModal('pricing')`.

### Akcja: Features card
- Trigger: klik kafelka.
- Efekt: otwiera `FeatureModal` z kontekstem.
- Side effects: `openModal('feature', { feature })`.

### Akcja: Integrations CTA (katalog)
- Trigger: button `integrations.btn_all`.
- Efekt: otwiera `IntegrationsModal`.
- Side effects: `openModal('integrations', { category: 'all' })`.

### Akcja: Integrations grid item
- Trigger: klik integracji.
- Efekt: otwiera `IntegrationConnectModal`.
- Side effects: `openModal('integration_connect', { integration })`.
- Coming soon: kafelki disabled, brak przejścia do connect.

### Akcja: Cookie consent
- Trigger: accept all / reject optional / save settings.
- Efekt: zapis do localStorage + updateConsentMode + zamknięcie.
- Side effects: initObservability jeśli analytical.

### Akcja: Promo modal timer
- Trigger: 30s po cookie resolution.
- Efekt: otwiera `PromoModal`.
- Side effects: close pokazuje teaser button.

### Akcja: Promo teaser
- Trigger: klik przycisku przyklejonego.
- Efekt: otwiera modal auth (register).

### Akcja: CTA w Vertex Player
- Trigger: klik CTA w `VertexPlayer`.
- Efekt: przejście do `/dashboard?mode=demo&scene={pipeline|exec|ai}`.

## Walidacje i komunikaty
- Brak formularzy na screenie; walidacje w modalach.

## Dane i integracje
- Źródło danych: i18n (translations), lokalny state (promo, cookies).
- Model danych: brak wymaganego API.
- Kody błędów: n/a.

## A11y
- Focus trap w CookieBanner (modal).
- ESC zamyka CookieBanner (reject) i PromoModal (close).
- Role/aria: hero h1, modal aria-label/aria-describedby.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: smoke + a11y (focus-visible na CTA, modale zamykane ESC).
