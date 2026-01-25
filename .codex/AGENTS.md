# PapaData  Codex Audit Contract

## ETAP 1  Diagnostyka (bez zmian)
Uruchom:
- pnpm -w run verify:local
Jeśli padnie: przerwij i wypisz pierwszy błąd + root-cause (plik/linia) + co dalej.

## ETAP 2  Raport
Wypisz 10 problemów (severity + dowód + wpływ + rekomendacja).

## ETAP 3  Naprawy (TOP 3)
Napraw tylko 3 najważniejsze problemy.
Max 5 plików zmienionych łącznie. Bez nowych zależności.
Po zmianach uruchom:
- pnpm -w run lint
- pnpm -w run test:api:e2e
- pnpm -w run test:smoke

## Zakres
apps/api, apps/web, libs/*

## Ignoruj
node_modules, dist, build, .next, coverage, .git
