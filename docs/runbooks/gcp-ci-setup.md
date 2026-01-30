# GCP CI/CD Setup (Cloud Build + Artifact Registry + Secrets)

## Cloud Build Triggers

1. Otwórz Cloud Build → Triggers.
2. STG trigger:
   - repo: `papadata.pl`
   - branch: `main`
   - config: `cloudbuild/stg.yaml`
   - SA: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com` (musi mieć `artifactregistry.writer` + `run.admin`/deploy do usług STG)
3. PROD trigger:
   - tag: `v*` **lub** manual trigger
   - config: `cloudbuild/prod.yaml`
   - promocja istniejących obrazów (substitution `_IMAGE_TAG`)
4. Polityka tagowania release:
   - build/taguję obraz commit SHA (Cloud Build substitution `${COMMIT_SHA}`)
   - promocja PROD na tag `v*` lub `CONFIRM_PROD=1` (patrz `package.json` script `promote:prod`)

## Artifact Registry (europe-central2)

```bash
gcloud artifacts repositories create papadata-platform \
  --repository-format=docker \
  --location=europe-central2 \
  --description="PapaData images"
```

Nadaj uprawnienia Cloud Build:

```bash
gcloud projects add-iam-policy-binding papadata-platform-stg \
  --member=serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com \
  --role=roles/artifactregistry.writer
```

Runtime SA (Cloud Run) potrzebuje `artifactregistry.reader` jeśli obraz prywatny w regionie.

## Secret Manager -> Cloud Run

Przykład mapowania (gcloud run deploy):

```bash
--set-secrets DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest
```

Zasada: brak sekretów w plaintext `--set-env-vars`.

## Definition of Done po deployu

- `node tools/verify-stg.mjs` przechodzi bez błędów.
- `/api/health` 200.
- `/api/ai/chat?stream=0` 200 JSON.
- `/api/ai/chat?stream=1` SSE kończy `[DONE]`.
- CORS poprawny dla `https://stg.papadata.pl`.
