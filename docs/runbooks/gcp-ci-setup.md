# GCP CI/CD Setup (Cloud Build + Artifact Registry + Secrets)

## Cloud Build Triggers
1) Otworz Cloud Build -> Triggers.
2) Utworz trigger dla STG:
   - repo: papadata.pl
   - branch: `main`
   - config: `cloudbuild/stg.yaml`
3) Utworz trigger dla PROD:
   - tag: `v*` lub manual
   - config: `cloudbuild/prod.yaml`

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

## Secret Manager -> Cloud Run
Przyklad mapowania (gcloud run deploy):
```bash
--set-secrets DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest
```

## Definition of Done po deployu
- `node tools/verify-stg.mjs` przechodzi bez bledow.
- `/api/health` 200.
- `/api/ai/chat?stream=0` 200 JSON.
- `/api/ai/chat?stream=1` SSE konczy `[DONE]`.
- CORS poprawny dla `https://stg.papadata.pl`.
