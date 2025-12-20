# Bezpieczeństwo (baseline)

## Dane i PII
- w demo: brak prawdziwych danych
- w produkcji: klasyfikacja danych i polityka minimalizacji

## Sekrety
- frontend nie przechowuje sekretów poza env runtime/build
- klucze i tokeny: w produkcji przez bezpieczne mechanizmy (np. Secret Manager)

## AI
- filtr PII przed wysłaniem do AI (docelowo)
- logowanie: bez payloadów z danymi wrażliwymi

## Headers/CSP (deploy)
- CSP dopasowane do źródeł assetów
- secure headers (X-Content-Type-Options, Referrer-Policy itd.)
