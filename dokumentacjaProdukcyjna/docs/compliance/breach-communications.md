# Breach Communications

Ten dokument zestawia komunikację w przypadku naruszenia danych – od potwierdzenia incydentu po notyfikację regulatora, klientów i partnerów.

1. Data incydentu
2. Określony poziom ryzyka (niski/średni/wysoki)
3. Organy/klienci powiadomieni (organ nadzorczy, osoby, partnerzy)
4. Kanały komunikacji (email, portal statusowy, prasa)
5. Kontakt w organizacji (Security Lead, DPO, Legal)

## Proces komunikacji

1. Security Lead triage'uje incydent, przypisuje priorytet oraz bierze pod uwagę, czy wystąpiło ujawnienie danych osobowych (High risk) – w razie potrzeby wywołuje drużynę incident response,
2. W ciągu 24 h przygotowujemy podsumowanie dla DPO/Legal z zaleceniem powiadomienia; DPO podejmuje decyzję o zgłoszeniu do UODO w ciągu 72 h od potwierdzenia i/lub o alertach do klientów,
3. Powiadomienie UODO oraz osoby odbywa się za pomocą e-maila z opisem incydentu, wpływu i działań korygujących; kopia komunikacji jest archiwizowana w `docs/compliance/breach-communications.md` i `incident-response.md` (sekcja „Krok 6 – Komunikacja”),
4. Status incydentu aktualizujemy na portalu statusowym i w Jira `CMP-INCIDENTS`, a powiadomienia dla klientów kierujemy przez support@papadata.pl lub dedykowanego Customer Success Managera.

## Przykład wpisu

- 2026-01-12 – podatność w pipeline, medium risk – powiadomiono UODO (mail), 5 klientów (email) – Security Lead, DPO

Notatki trafiają także do `../operations/incident-response.md` do sekcji „Krok 6 – Komunikacja”.
