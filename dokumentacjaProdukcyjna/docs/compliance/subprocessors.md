# Subprocessors

Lista podwykonawców, którzy przetwarzają dane w imieniu PapaData Intelligence. Każdy podmiot ma podpisaną umowę powierzenia danych (DPA) oraz posiada mechanizmy zgodne z RODO (SCC, decyzja adekwatności lub inny mechanizm transferu). Aktualizacje publikujemy w tej sekcji i informujemy klientów co najmniej 15 dni wcześniej.

| Podwykonawca | Zakres | Lokalizacja | Uwagi |
|--------------|--------|-------------|-------|
| Google Cloud Platform | Hosting infrastruktury, BigQuery, Vertex AI, pipeline danych | europe-central2 / europe-west1 | Dane przechowywane i przetwarzane wyłącznie w UE w modelu GCP |
| Firebase (Google Identity) | Authentication, tokeny i profile użytkowników | europe-west1 | Dostęp tylko na podstawie roli i z anonimizacją IP |
| Stripe | Rozliczenia subskrypcji i płatności | EU (Amsterdam) + USA (gdzie wymagane) | Klienci mogą korzystać z portalu Stripe Billing z redirectem |
| Sentry | Observability i telemetry błędów | EU (Frankfurt) | Akceptujemy tylko dane bez PII (anonimizowane stack trace) |
| Meta Pixel / Meta Ads | Marketing (tylko po zgodzie) | UE / USA | Przetwarzanie ograniczone do anonimizowanego identyfikatora, w zgodzie z consent mode |
| Google Analytics 4 | Telemetria front-end | EU (Holland) | Zgoda użytkownika decyduje o włączeniu tagów analytics |

Wszelkie zmiany są komunikowane klientom/przetwarzającym co najmniej 15 dni przed wdrożeniem.
