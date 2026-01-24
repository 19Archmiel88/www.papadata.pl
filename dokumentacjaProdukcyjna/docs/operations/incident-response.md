# Operations — Incident Response (Production + Public DEMO 1:1)

## Cel
Zdefiniować proces reagowania na incydenty dostępności, bezpieczeństwa, jakości danych oraz incydenty AI — dla środowiska produkcyjnego oraz publicznego DEMO.

Powiązane (źródła prawdy):
- Runbook: `runbook.md`
- Observability: `../engineering/observability.md`
- Security baseline: `../engineering/security.md`
- Privacy & data: `../compliance/privacy-and-data.md`
- Backups & retention: `backups-and-retention.md`
- SLA: `sla.md`

---

## 0) Zasady ogólne
- Priorytet: **bezpieczeństwo danych** > **dostępność** > **koszt** > **komfort UX**.
- W incydencie ograniczamy komunikację do jednego kanału “war room” + ticket.
- Nie wklejamy PII/sekretów do Slacka/Teams/ticketów. Jeśli potrzebne, używamy bezpiecznego kanału (Google Workspace Drive z ograniczonym dostępem i wygasającym linkiem; dla sekretów Secret Manager lub zaszyfrowane archiwum z hasłem przekazywanym osobnym kanałem).
- DEMO traktujemy jako publiczny ruch (hostile internet). Metryki muszą być tagowane `mode=demo|prod`.

---

## 1) Definicja incydentu
Incydent to zdarzenie, które:
- powoduje niedostępność usługi (w całości lub krytycznych funkcji),
- narusza poufność/integralność danych,
- powoduje ryzykowne zachowanie AI (np. ujawnianie danych, brak safety),
- znacząco degraduje UX w krytycznych flow (login, dashboard, eksport danych),
- powoduje niekontrolowany koszt (np. spike AI) lub nadużycia (abuse).

---

## 2) Role i odpowiedzialności (RACI)

- **Incident Commander (IC)** — On-call Ops/Platform; prowadzi incydent, podejmuje decyzje, pilnuje komunikacji.
- **Engineering Lead** — Backend lub Frontend Lead (w zależności od wpływu); prowadzi diagnozę i naprawę techniczną.
- **Ops/Platform** — deploy/rollback, konfiguracje CDN/WAF, rate limiting.
- **Security/Legal** — kwalifikacja incydentów bezpieczeństwa i RODO, decyzje o notyfikacji.
- **Comms/Support** — Support Lead; status page, komunikaty do klientów, obsługa zgłoszeń.

Minimalny podział odpowiedzialności:
- IC: “co robimy teraz”, timeline, status updates.
- Eng Lead: “dlaczego i jak naprawiamy”, zmiany techniczne.
- Support/Comms: “co mówimy i gdzie”.
- Security/Legal: “czy to breach i co z obowiązkami”.

---

## 3) Kanały i narzędzia

- Status page: https://status.papadata.pl
- Support: support@papadata.pl
- Security: security@papadata.pl
- Wewnętrzne: Slack `#incidents`
- War room (call): Google Meet (ad-hoc “Incident War Room” z Google Calendar)
- Issue tracker (incident ticket): Jira `CMP-INCIDENTS`
- Observability:
  - error tracking: Sentry
  - metryki/logi: GCP Cloud Monitoring + Cloud Logging
- Feature flags / kill switch: Cloud Run env `AI_ENABLED`, `AI_ENABLED_DEMO`, `AI_ENABLED_PROD` (zmiana przez Ops/Platform, zatwierdzona przez IC); UI pokazuje fallback, gdy API zwraca 503

---

## 3.1 Ownerzy alertow (MVP)

- **Frontend error spike**: Frontend owner / On-call
- **Backend 5xx / latency**: Backend owner / On-call
- **AI timeout / safety spike**: AI owner / On-call
- **Security / PII risk**: Security/Legal
- **Demo abuse / bot traffic**: Ops/Platform

---

## 3.2 Progi alertow (MVP, do strojenia)

**Uptime**
- `/` lub `/api/health` niedostepne w 3 kolejnych probach w 5 minutach.

**Frontend**
- Error rate > 2% w 5 minut.
- 50+ bledow runtime w 5 minut.

**Backend**
- 5xx rate > 2% w 5 minut.
- p95 latency > 1500 ms przez 10 minut.

**AI**
- Timeout rate > 5% w 5 minut.
- Safety blocks > 10% w 10 minut.

**Koszt / abuse (DEMO)**
- Wzrost zapytan AI > 3x tydzien do tygodnia (alert kosztowy).
- Nienaturalny wzrost ruchu z jednego ASN/IP (sygnal do WAF/rate limit).

Tagowanie alertow:
- `mode=demo|prod`, `env=dev|staging|prod`, `release`.

---

## 3.3 Reakcja na alert (minimum)

1) Potwierdz alert i wyznacz ownera (z 3.1).
2) Sprawdz `mode` i `env` oraz ostatni release.
3) Triage wg SEV + uruchom war room dla SEV0/SEV1.
4) Mitigacja: rollback / kill switch / ograniczenia ruchu.
5) Aktualizacja statusu wg sekcji 6.

---

## 4) Klasyfikacja incydentu (Severity)

> Cel: jednolite kryteria i przewidywalna komunikacja.

### 4.1 Kryteria SEV (minimum)
- **SEV0 (Critical)**
  - szeroka niedostępność produkcji, lub
  - potwierdzony/prawdopodobny wyciek danych/sekretów, lub
  - niekontrolowany koszt (np. AI) z ryzykiem finansowym, lub
  - krytyczny incident bezpieczeństwa.
- **SEV1 (High)**
  - degradacja kluczowych funkcji dla części klientów,
  - wysoki impact na KPI klienta (np. błędne dane w dashboardzie) bez obejścia,
  - istotne problemy AI (safety blocks/halucynacje z ryzykiem biznesowym) bez łatwego obejścia.
- **SEV2 (Medium)**
  - błąd nieblokujący, obejście istnieje,
  - problem lokalny (np. 1 integracja) bez efektu lawinowego.
- **SEV3 (Low)**
  - minor/kosmetyka, brak istotnego wpływu.

### 4.2 Oczekiwane czasy (response/update)
- SEV0:
  - start triage: do 15 min
  - status update: co 60 min
- SEV1:
  - start triage: do 30 min
  - status update: co 120 min
- SEV2:
  - start triage: do 4h (godziny pracy)
  - status update: 1x dziennie
- SEV3:
  - start triage: do 2 dni roboczych
  - status update: wg potrzeb

---

## 5) Workflow incydentu (end-to-end)

### 5.1 Detekcja
Źródła:
- alerty z obserwowalności,
- zgłoszenia support,
- monitoring syntetyczny,
- alarmy kosztów (AI),
- sygnały abuse (DEMO).

IC lub on-call uruchamia “incident ticket” i war room dla SEV0/SEV1.

### 5.2 Triage (pierwsze 15 minut)
Zbierz minimum:
- co nie działa (symptomy), od kiedy, jaka skala,
- czy dotyczy DEMO czy PROD (`mode=demo|prod`),
- wpływ na SLA (jeśli dotyczy) i kluczowe flow,
- ostatnie zmiany (release/build sha),
- czy to może być security/privacy (eskalacja do Security/Legal),
- czy jest ryzyko kosztowe (AI).

Checklist:
- [ ] utworzony incident ticket
- [ ] wyznaczony IC i Eng Lead
- [ ] war room uruchomiony (SEV0/SEV1)
- [ ] pierwsza notatka: “Impact + czas startu + zakres”

### 5.3 Mitigation (szybkie ograniczenie wpływu)
Możliwe działania:
- rollback wersji (patrz `runbook.md`),
- feature flag / kill switch (np. wyłączenie AI drawer),
- degradacja kontrolowana (np. read-only, wyłączenie kosztownych funkcji),
- w public DEMO: wzmocnienie rate limiting / bot protection.

Mechanizm kill switch:
- Cloud Run env `AI_ENABLED`, `AI_ENABLED_DEMO`, `AI_ENABLED_PROD` (zmiana przez Ops/Platform po akceptacji IC).
- Dodatkowo: szybki rollback release według `runbook.md`.

### 5.4 Recovery (przywrócenie)
- przywrócenie usługi i weryfikacja (smoke tests z `runbook.md`),
- monitoring po naprawie (co najmniej 30–60 min dla SEV0/SEV1); progi: 5xx < 1%, p95 < 1200 ms, frontend error rate < 1% utrzymane przez 60 min.

### 5.5 Zamknięcie incydentu
- potwierdzenie stabilności,
- final status update,
- zaplanowanie RCA/postmortem (sekcja 9).

---

## 6) Komunikacja (internal + status page + klient)

### 6.1 Zasady
- Aktualizacje informują o stanie i działaniach, nie obiecują czasu naprawy, jeśli niepewne.
- “ETA kolejnej aktualizacji” jest OK; “ETA naprawy” tylko gdy potwierdzone.
- Dla SEV0/SEV1 status page jest domyślny, chyba że umowa stanowi inaczej.

### 6.2 Template status update (zewnętrzny)
- **Status:** Investigating / Identified / Monitoring / Resolved
- **Impact:** co nie działa, dla kogo (zakres)
- **Mitigation:** co robimy teraz
- **Next update:** kiedy kolejna aktualizacja

### 6.3 Template wewnętrzny (war room note)
- Start time (UTC + lokalnie)
- Severity
- Scope (demo/prod, tenants)
- Current hypothesis
- Actions taken (timeline)
- Owner i next steps

---

## 7) Public DEMO 1:1 — specyficzne incydenty

Typowe:
- abuse/boty (spike ruchu),
- koszt AI / timeouty / safety blocks,
- scraping,
- awarie routingu SPA (rewrites) wpływające na demo.

Mitigacje (minimum):
- rate limiting / bot mitigation — Cloud Armor WAF + reguły rate-based,
- tymczasowe wyłączenie AI w DEMO (fallback UI),
- oddzielenie telemetryki DEMO vs PROD (`mode=demo|prod`),
- jeśli demo degraduje prod: priorytetem jest ochrona prod (odcięcie/limit demo).

Playbook: **cost spike AI (DEMO)**
1) kill switch: wyłącz AI w DEMO,
2) zaostrz rate limit/WAF,
3) sprawdź logi i wzorce ruchu,
4) jeśli podejrzenie wycieku klucza: rotacja klucza w Secret Manager (nowa wersja sekretu), aktualizacja Cloud Run i odcięcie starej wersji.

---

## 8) Incydenty bezpieczeństwa / RODO (minimum)

Role zgodne z DPA i Privacy Policy:
- Produkcja: klient jest Administratorem, Papadata jest Procesorem.
- Public DEMO: Papadata jest Administratorem.

### 8.1 Zasady dowodowe (evidence handling)
- Zabezpiecz logi/ślady/timeline.
- Nie kopiuj danych osobowych do ticketów/czatów.
- Zapisuj:
  - timestampy,
  - identyfikatory żądań (request id),
  - zakres (tenant/workspace),
  - działania mitigacyjne i kto je wykonał.

### 8.2 Kwalifikacja incydentu (decision)
Checklist:
- [ ] Czy były dane osobowe? (PII)
- [ ] Czy doszło do utraty poufności/integralności/dostępności?
- [ ] Jaki zakres i liczba podmiotów danych? (szacunek)
- [ ] Czy wymagane notyfikacje? (organ / klienci / osoby)

Jeśli kwalifikuje się jako naruszenie ochrony danych:
- zgłoszenie do organu w 72h (jeśli wymagane),
- komunikacja do klientów/osób, jeśli wysokie ryzyko,
- pełna dokumentacja: impact, dane, działania naprawcze.

### 8.3 Legal hold
Jeśli wymagane:
- wstrzymać automatyczne usuwanie logów/artefaktów związanych z incydentem: zwiększyć retencję w Cloud Logging i wyłączyć TTL w BigQuery/GCS dla zakresu incydentu.

---

## 9) AI-specific checklist

- wstrzymaj rollout promptów (jeśli stosujecie),
- sprawdź safety mapping i prompt registry (jeśli istnieje),
- wyłącz AI drawer (feature flag) w DEMO/PROD zależnie od wpływu,
- weryfikuj czy AI nie loguje promptów z PII,
- sprawdź koszty i rate limiting (szczególnie DEMO),
- sprawdź czy odpowiedzi AI zawierają “evidence/źródła” i czy nie uległy regresji (Trust UX).

---

## 10) Data/Analytics incident (błędne KPI / złe dane)

Sygnały:
- “KPI skaczą nienaturalnie”
- “Brakuje danych z integracji”
- “Rozjazd ROAS vs spend”

Checklist:
- [ ] czy to dotyczy jednego źródła czy wielu
- [ ] sprawdź freshness (opóźnienie importu)
- [ ] sprawdź transformacje / walidacje jakości (jeśli macie)
- [ ] jeśli błąd release: rollback
- [ ] jeśli błąd danych klienta: komunikacja + workaround

Link w UI: `/integrations` (status połączeń) oraz Overview (karty freshness/coverage).

---

## 11) Artefakty (wymagane)

- **Incident ticket**: Jira `CMP-INCIDENTS` (typ: Incident Report)
- **Timeline**: w ticket lub osobny doc (min: kto/co/kiedy)
- **Status updates**: historia na status page + notatki w ticketcie incydentu
- **RCA template** (minimum):
  - What happened
  - Impact (kto i jak)
  - Root cause
  - Detection (dlaczego nie wykryliśmy wcześniej)
  - Resolution (co zrobiliśmy)
  - Action items (owner, due date, priorytet)
  - Follow-ups (monitoring/testy/runbook updates)

---

## 12) Checklist przed go-live
- Status page aktywna i zweryfikowana.
- Kanały wsparcia i bezpieczeństwa aktywne (support@papadata.pl, security@papadata.pl).
- WAF/Rate limiting skonfigurowany (Cloud Armor).
- Kill switch zweryfikowany (`AI_ENABLED*`).
- Czasy reakcji i aktualizacji spójne z [dokumentem SLA](sla.md).
