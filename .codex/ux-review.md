# Manualny UX Review Guide — papadata.pl

Cel dokumentu: wesprzeć człowieka w **ręcznym** przeglądzie UX bez uruchamiania aplikacji lub automatycznych testów. Checklisty i pytania bazują na specyfikacjach UX dla dashboardu (v2) oraz wymaganiach DEMO/PROD 1:1, stanach UI i zasadach interakcji. Odwołuj się do nich w trakcie review, nawet jeśli część funkcji jest jeszcze w budowie.

---

## 1) Krytyczne ścieżki użytkownika — checklist

### 1.1 Onboarding / first view
- [ ] Czy pierwsze wrażenie wyjaśnia **„co to jest”** i **„po co”** (value proposition)?
- [ ] Czy **tryb DEMO** jest jednoznacznie widoczny (badge/oznaczenie)?
- [ ] Czy dostępne są jasne ścieżki do **logowania / rejestracji / rozpoczęcia trialu**?
- [ ] Czy onboarding nie blokuje dostępu do kluczowego kontekstu (np. dashboard/overview)?
- [ ] Czy pierwszy ekran prezentuje **najważniejsze alerty i KPI** bez konieczności dodatkowej nawigacji?

### 1.2 Główne CTA
- [ ] Czy **główne CTA** jest jednoznaczne i konsekwentne w całym produkcie (np. „Rozpocznij trial”, „Podłącz integracje”, „Wyjaśnij w AI”)?
- [ ] Czy CTA ma jasny skutek i feedback (toast/loader/modal)?
- [ ] Czy CTA w DEMO **nie wykonują write-actions**, ale konsekwentnie pokazują flow (np. modal „To jest DEMO”)?
- [ ] Czy CTA są rozmieszczone zgodnie z hierarchią informacji (alerty/insighty > akcje poboczne)?

### 1.3 Formularze i modale
- [ ] Czy wszystkie formularze mają czytelne etykiety, stany błędów i poprawne domyślne wartości?
- [ ] Czy modale/drawery mają **focus trap**, zamykają się `ESC`, i nie gubią kontekstu?
- [ ] Czy formularze nie wymagają zbyt wielu pól na starcie (progressive disclosure)?
- [ ] Czy akcje „Zapisz/Anuluj” są spójne w copy i pozycjonowaniu?

### 1.4 Stany empty / error / loading
- [ ] Czy loading występuje **na poziomie widgetów**, a nie blokuje całego ekranu?
- [ ] Czy empty state wyjaśnia **dlaczego** (brak danych / filtry / brak integracji) i prowadzi do CTA?
- [ ] Czy error state ma jasny komunikat + ścieżkę naprawy (np. „Przejdź do Integracji”)?
- [ ] Czy partial data jest komunikowane (część danych dostępna, część nie)?

---

## 2) Heurystyki UX — checklist

### 2.1 Jasność komunikatów
- [ ] Czy komunikaty nie są zbyt techniczne dla użytkownika biznesowego?
- [ ] Czy mikrocopy wyjaśnia **dlaczego** coś jest zablokowane (plan/trial/DEMO)?
- [ ] Czy informacje o świeżości danych są zrozumiałe i nieprzytłaczają?

### 2.2 Spójność CTA
- [ ] Czy CTA mają konsekwentną nazwę i ikonografię (np. „Wyjaśnij w AI”)?
- [ ] Czy konsekwentnie rozróżniamy CTA główne i drugorzędne?

### 2.3 Hierarchia wizualna
- [ ] Czy alerty i krytyczne KPI są widoczne „above the fold”?
- [ ] Czy ważne informacje (alerty/insighty) mają pierwszeństwo przed dekoracją?
- [ ] Czy układ nie „rozjeżdża się” w sekcjach z dużą ilością danych (tabele/wykresy)?

### 2.4 Przewidywalność zachowania UI
- [ ] Czy kliknięcie w element ma **jedno przewidywalne** zachowanie (drill-down, detal, filtr)?
- [ ] Czy filtry globalne są konsekwentne we wszystkich widokach?
- [ ] Czy reset filtrów i „undo” są łatwo dostępne?

---

## 3) Mobile-first review — checklist

### 3.1 Dostępność kluczowych akcji kciukiem
- [ ] Czy główne CTA i nawigacja są w zasięgu kciuka?
- [ ] Czy ważne akcje nie są ukryte w overflow bez wyraźnego powodu?

### 3.2 Rozmiar i ergonomia elementów
- [ ] Czy elementy interaktywne nie są zbyt małe (minimalny sensowny rozmiar dotykowy)?
- [ ] Czy odstępy między interaktywnymi elementami zapobiegają „mis-tap”?

### 3.3 Modale / formularze bez blokowania kontekstu
- [ ] Czy modal/drawer nie zasłania kluczowego kontekstu bez możliwości szybkiego zamknięcia?
- [ ] Czy formularze na mobile są uproszczone (mniej pól na raz, sensowne typy inputów)?

---

## 4) Dark / Light mode — checklist

- [ ] Czy hierarchia informacji jest taka sama w light i dark?
- [ ] Czy kontrast jest czytelny dla KPI, alertów i CTA?
- [ ] Czy nie ma elementów „znikających” (np. ikon, dividerów, tekstów secondary)?
- [ ] Czy stany hover/focus/active są widoczne w obu trybach?

---

## 5) Obszary wysokiego ryzyka (bazując na WERSJI 1 i 2)

Poniższe elementy są krytyczne i wymagają zwiększonej uwagi podczas manualnego review:

1. **DEMO vs PROD (kontrakt 1:1)**
   - Ryzyko: rozjazd UI/UX między DEMO i PROD (różny układ, brakujące stany).
   - Krytyczne: zachowania write-actions w DEMO (blokada/symulacja).

2. **Plan/Trial gating**
   - Ryzyko: niejasne komunikaty o blokadzie funkcji, zbyt agresywne paywalle.
   - Krytyczne: banner trialu, CTA do aktywacji, spójność komunikatów.

3. **AI Panel + Guardian**
   - Ryzyko: brak zaufania do AI (brak dowodów / brak świeżości danych).
   - Krytyczne: streaming, cancel, safety block, retry, kontekst zapytań.

4. **Stany danych (loading/empty/error/partial/offline)**
   - Ryzyko: brak jasnego wyjaśnienia „dlaczego” i brak CTA do naprawy.
   - Krytyczne: widget-level loading i czytelne empty/error.

5. **Drill-down i filtry globalne**
   - Ryzyko: brak zachowania kontekstu (daty/filtry) podczas drill-down.
   - Krytyczne: reset filtrów i spójność działania w różnych widokach.

6. **Eksporty raportów (PDF/CSV/JSON)**
   - Ryzyko: nieczytelny flow lub brak informacji o statusie eksportu.
   - Krytyczne: jasny feedback, historia eksportów i DEMO-symulacja.

7. **Mobile ergonomia**
   - Ryzyko: CTA poza zasięgiem kciuka, zbyt małe elementy w tabelach/wykresach.
   - Krytyczne: dostępność najważniejszych akcji na małych ekranach.

---

## 6) Pytania kontrolne (YES/NO)

### 6.1 Krytyczne ścieżki
- [ ] Czy użytkownik w 20–60 sekund rozumie „co się dzieje” i „co zrobić dalej”?
- [ ] Czy DEMO jasno tłumaczy ograniczenia i kieruje do trialu?
- [ ] Czy główne CTA są spójne i łatwe do znalezienia?
- [ ] Czy formularze/modale nie blokują kontekstu i są łatwe do zamknięcia?
- [ ] Czy stany empty/error/loading prowadzą do następnego kroku?

### 6.2 Heurystyki UX
- [ ] Czy komunikaty są jednoznaczne i pozbawione zbędnego żargonu?
- [ ] Czy hierarchia wizualna prowadzi wzrok do najważniejszych danych?
- [ ] Czy zachowanie UI jest przewidywalne (bez „niespodzianek” po kliknięciu)?

### 6.3 Mobile-first
- [ ] Czy kluczowe akcje są w zasięgu kciuka?
- [ ] Czy elementy interaktywne mają wystarczający rozmiar?
- [ ] Czy modale/formy na mobile nie zakrywają kluczowego kontekstu?

### 6.4 Dark/Light
- [ ] Czy kontrast i hierarchia informacji są identyczne w obu trybach?
- [ ] Czy żaden kluczowy element nie „znika” w dark/light?

---

## 7) Sugerowany sposób pracy (manual)

1. Przejdź **krytyczne ścieżki** (onboarding → CTA → formularze → stany UI).
2. Zrób „minutowy” audit hierarchii: czy widać alerty, KPI i CTA bez scrolla?
3. Powtórz kroki na **mobile** (najlepiej na realnym urządzeniu).
4. Powtórz kroki w **dark i light** (manual switch).
5. Zapisuj obserwacje w formacie: *problem → wpływ → rekomendacja*.

---

## 8) Notatki do wypełnienia podczas review

- Największe tarcia w onboarding:
- Najbardziej mylące CTA:
- Najsłabsze empty/error states:
- Największe problemy na mobile:
- Elementy „znikające” w dark/light:

