# Polityka cookies (Production)

> Ten dokument opisuje użycie plików cookies i podobnych technologii w serwisie PapaData Intelligence (w tym w publicznym trybie DEMO 1:1).

## 1) Administrator i kontakt
Administratorem danych (o ile cookies wiążą się z danymi osobowymi) jest:
- **PapaData Intelligence Sp. z o.o.**
- ul. Prosta 51, 00-838 Warszawa, Polska
- KRS: 0000759747 / NIP: 5252781906 / REGON: 390501170
- Kontakt dot. prywatności: **privacy@papadata.pl**

Powiązany dokument: `privacy-policy.md`.

## 2) Czym są cookies i podobne technologie
Cookies to niewielkie pliki tekstowe zapisywane w urządzeniu użytkownika. Używamy również podobnych technologii (np. localStorage) wyłącznie w zakresie koniecznym do działania serwisu i zgodnie z ustawieniami zgód.

## 3) Kategorie cookies
### 3.1 Niezbędne (always-on)
Służą do działania serwisu (np. bezpieczeństwo, zapamiętanie ustawień interfejsu).  
Te cookies nie wymagają zgody, o ile są rzeczywiście konieczne.

Przykłady zastosowań:
- utrzymanie sesji (jeśli dotyczy),
- ustawienia języka i motywu (dark/light),
- ochrona przed nadużyciami (np. rate limiting / bot mitigation — jeśli realizowane cookies).

### 3.2 Analityczne (opcjonalne — wymagają zgody)
Służą do pomiaru użycia serwisu i poprawy UX (np. błędy, wydajność, zachowania użytkownika).

Zasady:
- uruchamiane dopiero po wyrażeniu zgody,
- minimalizujemy zakres danych,
- nie zapisujemy w eventach PII ani sekretów.

### 3.3 Marketingowe (opcjonalne — wymagają zgody)
Służą do działań marketingowych (np. remarketing), jeśli są używane.

Zasady:
- domyślnie WYŁĄCZONE,
- uruchamiane dopiero po wyrażeniu zgody,
- aktywne tylko gdy skonfigurowane są identyfikatory (VITE_GOOGLE_ADS_ID / VITE_META_PIXEL_ID).

## 4) Zarządzanie zgodami
W serwisie dostępny jest:
- **banner cookies** z opcjami:
  - `Odrzuć wszystkie`
  - `Akceptuj wybrane`
  - `Akceptuj wszystkie`
- **panel ustawień** umożliwiający zmianę zgód w dowolnym momencie.

Wycofanie zgody:
- użytkownik może zmienić decyzję w panelu cookies poprzez link „Ustawienia cookies” w stopce (landing i dashboard).

## 5) Consent Mode v2 (jeśli dotyczy)
Jeśli używacie Google Consent Mode v2, stosujemy sygnały:
- `ad_storage`
- `analytics_storage`
- `ad_user_data`
- `ad_personalization`

Zasady:
- wartości ustawiane zgodnie z wyborem użytkownika w bannerze,
- brak „domyślnej zgody” na marketing.

Consent Mode v2 jest wdrożony w [apps/web/utils/consent-mode.ts](../../apps/web/utils/consent-mode.ts#L1-L120).

## 6) Dostawcy i lista cookies
Poniżej lista wykorzystywanych narzędzi i storage.

### 6.1 Niezbędne
| Nazwa cookie / storage | Dostawca | Cel | Typ | Czy wymagane | Retencja |
|---|---|---|---|---|---|
| `cookie_consent` | PapaData | zapis preferencji zgód | localStorage | tak | 12 miesięcy |
| `theme` | PapaData | zapamiętanie motywu UI | localStorage | tak | do zmiany przez użytkownika |
| `lang` | PapaData | zapamiętanie języka UI | localStorage | tak | do zmiany przez użytkownika |
| `papadata_auth` | PapaData | stan autoryzacji (flag) | localStorage | tak | do wylogowania |
| `papadata_auth_token` | PapaData | token sesji (Bearer) | localStorage | tak | do wylogowania |
| `papadata_user_id` | PapaData | identyfikator użytkownika | localStorage | tak | do wylogowania |
| `papadata_user_roles` | PapaData | role użytkownika | localStorage | tak | do wylogowania |
| `pd_active_tenant_id` | PapaData | aktywny tenant | localStorage | tak | do zmiany/wylogowania |
| `pd_post_login_redirect` | PapaData | powrót po logowaniu | localStorage | tak | usuwany po użyciu |
| `pd_selected_plan` | PapaData | preferencja planu z cennika | localStorage | tak | 30 dni |
| `pd_billing_state` | PapaData | stan rozliczeń klienta | localStorage | tak | 30 dni |
| `sysLogId` | PapaData | identyfikator sesji UI | sessionStorage | tak | do zamknięcia przeglądarki |

### 6.2 Analityczne
| Nazwa cookie / storage | Dostawca | Cel | Typ | Wymaga zgody | Retencja |
|---|---|---|---|---|---|
| `_ga`, `_ga_*` | Google Analytics 4 (jeśli skonfigurowane) | analityka ruchu | cookie | tak | 13 miesięcy |
| `sentry` (trace context) | Sentry (jeśli skonfigurowane) | błędy i wydajność | localStorage | tak | 30 dni |

### 6.3 Marketingowe (jeśli używane)
| Nazwa cookie / storage | Dostawca | Cel | Typ | Wymaga zgody | Retencja |
|---|---|---|---|---|---|
| `_fbp` | Meta Pixel (jeśli skonfigurowane) | remarketing | cookie | tak | 3 miesiące |
| `_gcl_au` | Google Ads (jeśli skonfigurowane) | konwersje reklamowe | cookie | tak | 3 miesiące |

## 7) Okres przechowywania (retencja)
- cookies sesyjne: usuwane po zamknięciu przeglądarki,
- cookies trwałe: przechowywane przez okres wskazany w tabelach powyżej.

## 8) Ustawienia przeglądarki
Niezależnie od panelu zgód możesz zarządzać cookies w ustawieniach przeglądarki (blokowanie/usuwanie). Pamiętaj, że zablokowanie cookies niezbędnych może wpłynąć na działanie serwisu.

## 9) Public DEMO 1:1 — zasady telemetryki i zgód
Publiczny tryb DEMO jest dostępny dla użytkownika niezalogowanego i:
- może generować zdarzenia analityczne (np. wejścia w demo, kliknięcia CTA),
- nie może przetwarzać danych klientów (brak PII, brak danych z integracji).

Zasady:
- telemetria DEMO respektuje te same zgody cookies co reszta serwisu,
- wszystkie eventy powinny być tagowane `mode=demo|prod`,
- w DEMO nie stosujemy mechanizmów marketingowych bez wyraźnej zgody użytkownika.

## 10) Zmiany dokumentu
Zastrzegamy możliwość aktualizacji polityki cookies. Zmiany publikujemy w serwisie.

- Ostatnia aktualizacja: **2026-01-20**
