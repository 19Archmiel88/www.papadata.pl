# PapaData Intelligence

Commercial SaaS analytics platform for e-commerce with a public demo mode.
Demo is a product mode: DEMO = PROD 1:1 (same UI/UX, data/AI/persistence are mocked).

## Repository layout

- `apps/web` - Vite SPA (React + TypeScript)
- `apps/api` - NestJS backend (dashboard, AI proxy, integrations)
- `libs/shared` - shared contracts and API client
- `dokumentacjaProdukcyjna/docs/index.md` - product/UX/engineering/ops/compliance docs

## Quickstart (local)

### Requirements
- Node.js: >=18.18 <23 (recommended 20/22 LTS)
- pnpm: >= 9

### Environment
Create local env files from examples:
```bash
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```
```powershell
Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force
```

### Install
```bash
pnpm install
```

### Run
```bash
# terminal 1
pnpm run api:dev

# terminal 2
pnpm run dev
```

More details: `docs/runbooks/local-verify.md`.
