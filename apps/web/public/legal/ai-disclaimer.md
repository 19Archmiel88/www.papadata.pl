# Nota prawna i zasady korzystania z AI (Papa Guardian)

Niniejszy dokument dotyczy funkcji asystenta AI w PapaData Intelligence (w tym publicznego trybu DEMO 1:1).

Powiązane:
- AI integration (technicznie): `../engineering/ai-integration.md`
- Security baseline: `../engineering/security.md`
- Privacy policy: `privacy-policy.md`

---

## 1) Charakter odpowiedzi (niedeterminizm)
Odpowiedzi generowane przez AI są probabilistyczne i mogą być:
- niepełne,
- nieaktualne,
- nieprecyzyjne lub błędne.

Użytkownik powinien weryfikować wyniki przed podjęciem decyzji biznesowych.

## 2) Brak porad profesjonalnych
AI nie świadczy porad prawnych, finansowych, podatkowych ani innych usług regulowanych. Jeśli potrzebujesz takich porad, skontaktuj się ze specjalistą.

## 3) Dane wprowadzane do AI (zakazy)
Nie wprowadzaj do AI:
- haseł, kluczy API, tokenów, sekretów,
- danych szczególnych (RODO) ani danych wrażliwych,
- danych, do których nie masz prawa (np. cudzych danych osobowych bez podstawy).

> W trybie DEMO traktuj pole wejścia jak publiczne: nie wpisuj żadnych danych identyfikujących.

## 4) Moderacja i safety
W celu bezpieczeństwa część odpowiedzi może zostać:
- zablokowana (np. przez filtry bezpieczeństwa),
- skrócona,
- zwrócona z komunikatem o ograniczeniach.

Próby omijania zabezpieczeń (jailbreak/prompt injection) są zabronione.

## 5) Logowanie i prywatność (high-level)
- Dążymy do tego, aby nie przechowywać treści promptów/odpowiedzi w logach w sposób umożliwiający identyfikację osoby.
- Logi techniczne mogą zawierać metadane (np. czas odpowiedzi, status, `mode=demo|prod`) bez treści wiadomości.
Retencja logów technicznych: 30 dni. Narzędzia: Cloud Logging + Sentry (bez treści promptów).

## 6) Prawa do treści (input / output)
- Użytkownik ponosi odpowiedzialność za treść wprowadzaną do AI (input).
- Wyniki (output) mogą być obciążone ryzykiem naruszeń (np. podobieństwo do istniejących treści). Zalecamy weryfikację przed publikacją lub wykorzystaniem komercyjnym.
Własność treści:
- Input i output pozostają własnością użytkownika/klienta.
- PapaData przetwarza treści wyłącznie w celu świadczenia usługi i nie używa ich do trenowania modeli.

## 7) Odpowiedzialność
AI jest narzędziem pomocniczym. Ostateczna odpowiedzialność za decyzje i działania podjęte na podstawie odpowiedzi AI spoczywa na użytkowniku/kliencie, w zakresie dopuszczalnym przez prawo i umowę.

## 8) Public DEMO 1:1
W DEMO:
- odpowiedzi mogą być mockowane lub ograniczone,
- celem jest pokaz funkcjonalności i UX,
- obowiązują te same zakazy dot. danych wrażliwych i sekretów.
