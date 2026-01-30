# Compliance — Accessibility (EAA) — Production

## Cel i zakres

Zapewnienie zgodności produktu PapaData Intelligence (PROD + publiczny DEMO 1:1) z European Accessibility Act (EAA), obowiązującym od **28.06.2025**. Minimalny standard zgodności: **WCAG 2.1 AA** dla wszystkich kluczowych ścieżek (landing, dashboard, modale/drawer, formularze, nawigacja).

## Wymagania

### Zależności

- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9
- Przeglądarki do testów manualnych: Chrome + Firefox (desktop)

### Porty

- WEB: 3000 (Vite dev server)

### Zmienne środowiskowe

- WEB: [apps/web/.env.example](../../../apps/web/.env.example)
  - VITE_API_BASE_URL=/api
  - VITE_API_PROXY_TARGET=http://localhost:4000

## Zakres (minimum produkcyjne)

Wymagane co najmniej:

- Nawigacja klawiaturą (Tab/Shift+Tab/Enter/Esc)
- Focus management (modale/drawer, focus trap, focus restore)
- Kontrast i czytelność typografii
- Tekst alternatywny dla elementów nietekstowych (lub alternatywa tekstowa)
- `prefers-reduced-motion`
- Dostępność formularzy (label, error messaging, aria-describedby)
- Dostępność komponentów wykresów:
  - każdy wykres musi mieć **tekstowe podsumowanie** i **alternatywę tabelaryczną** dostępną klawiaturą

## Owner i odpowiedzialność

- Owner dostępności: **UX Lead**
- Wsparcie: **Frontend Engineering Lead**

## Kroki uruchomienia lokalnie (copy-paste)

### Windows (PowerShell)

```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install
Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force
pnpm run api:dev
```

W nowym terminalu:

```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm run dev
```

### macOS/Linux (bash)

```bash
cd /path/to/www.papadata.pl
pnpm install
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
pnpm run api:dev
```

W drugim terminalu:

```bash
cd /path/to/www.papadata.pl
pnpm run dev
```

## Kroki testów (copy-paste)

### Windows (PowerShell)

```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm run test:web:unit
pnpm run test:smoke
```

### macOS/Linux (bash)

```bash
cd /path/to/www.papadata.pl
pnpm run test:web:unit
pnpm run test:smoke
```

## Kroki weryfikacji (smoke) + expected output

### 1) Keyboard navigation (manual)

Scenariusz: landing → demo dashboard → AI drawer

- Tab/Shift+Tab przechodzi po interaktywnych elementach bez „utknięcia”.
- Enter aktywuje przyciski i linki.
- Esc zamyka modal/drawer i focus wraca do elementu, który otworzył modal.

Oczekiwane:

- brak pułapek focusu poza modalami
- widoczny focus na każdym elemencie interaktywnym

### 2) Formularze (manual)

Scenariusz: formularz kontaktowy w stopce.

- Pola mają widoczne etykiety.
- Błędy walidacji są czytelne i związane z polem (aria-describedby).

Oczekiwane:

- komunikat błędu jest zrozumiały i powiązany z polem

### 3) Wykresy (manual)

Scenariusz: widok Overview i P&L.

- Każdy wykres posiada tekstowe podsumowanie i alternatywę tabelaryczną.

Oczekiwane:

- użytkownik może odczytać treść bez percepcji wizualnej wykresu

## Checklist — Definition of Done

- WCAG 2.1 AA: brak krytycznych i poważnych naruszeń w testach manualnych.
- Fokus widoczny i logiczna kolejność tabowania w kluczowych flow.
- Modale/drawer mają focus trap oraz focus restore.
- Formularze mają etykiety i czytelne błędy.
- Wykresy mają tekstowe podsumowanie i tabelę.
- Publiczny DEMO 1:1 zachowuje te same standardy co PROD.

## Harmonogram audytów

- Audyt wewnętrzny: **co kwartał**.
- Audyt zewnętrzny: **raz w roku**.
- Każdy release ze zmianami UI wymaga checklisty a11y.

## Deklaracja dostępności

- Link w stopce do: `../legal/accessibility-statement.md`
- Kontakt do zgłoszeń: **accessibility@papadata.pl**
