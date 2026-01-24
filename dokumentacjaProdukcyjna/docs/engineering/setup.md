# Setup developerski

## Wymagania
- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9

## Instalacja i uruchomienie

Instalacja zależności:
```bash
pnpm install
```

Utwórz lokalne pliki środowiskowe:
```bash
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```
```powershell
Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force
```

Uruchom API (terminal 1):
```bash
pnpm run api:dev
```

Uruchom WEB (terminal 2):
```bash
pnpm run dev
```

Więcej szczegółów: `../../docs/runbooks/local-verify.md`.
