# Operations — Incident Response

## Definicja incydentu
Każde zdarzenie, które:
- powoduje niedostępność usługi,
- ujawnia dane wrażliwe,
- generuje błędne zachowanie AI w sposób ryzykowny,
- lub znacząco degraduje UX (np. blokada kluczowych flow).

## Role
- Incident Commander: [PLACEHOLDER]
- Engineering: [PLACEHOLDER]
- Security/Legal: [PLACEHOLDER]

## Kanały
- Status page: [PLACEHOLDER]
- Support: support@[PLACEHOLDER_DOMAIN]
- Security: security@[PLACEHOLDER_DOMAIN]

## Procedura (skrót)
1. Triage: co nie działa, jaki wpływ, jaka skala
2. Mitigation: rollback / wyłączenie funkcji (feature flag) / komunikat w UI
3. Communication:
   - status page update
   - komunikat do klientów (jeśli dotyczy)
4. Root cause analysis (RCA) do 5 dni roboczych
5. Action items i prewencja

## AI-specific
- Jeśli AI daje niepożądane wyniki:
  - wyłącz AI drawer w UI (fallback)
  - sprawdź safety mapping i prompt registry
  - wstrzymaj rollout zmian promptów
