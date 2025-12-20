# Treści i i18n

## Języki
- PL i EN (minimum)

## Zasady
- brak “hard-coded” stringów w komponentach
- jedna struktura kluczy i18n dla obu języków
- fallback: EN (jeśli brakuje tłumaczenia)

## Struktura kluczy (przykład)
- landing.hero.*
- landing.pipeline.*
- dashboard.kpi.*
- dashboard.reports.*
- common.*
- legal.*

## QA tłumaczeń
- walidacja: klucze 1:1 PL/EN
- build-time check: brakujące klucze = błąd
