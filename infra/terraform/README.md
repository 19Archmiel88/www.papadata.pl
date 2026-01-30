# Terraform — GCP (Papadata)

Szkic infrastruktury dla projektu Papadata: Cloud Run (API + Web), Global HTTPS Load Balancer (path-based routing), Cloud Armor (rate limiting), Cloud DNS, Identity Platform (Google/Microsoft), Secret Manager oraz Cloud SQL.

Status: szkic referencyjny (nie production-ready, nieużywany jako IaC produkcyjne).
Aktualny stan produkcji i checklisty: `dokumentacjaProdukcyjna/GCP.md`.

## Szybki start

1. Skopiuj i uzupełnij [terraform.tfvars.example](terraform.tfvars.example).
2. Uruchom:
   - `terraform init`
   - `terraform plan -var-file=terraform.tfvars`
   - `terraform apply -var-file=terraform.tfvars`

> Uwaga: To jest **szkic**. Wymaga dostosowania nazw, obrazów kontenerów, IAM oraz polityk bezpieczeństwa.

## Zakres

- Cloud Run:
- Path-based routing: `/api/*` → API, reszta → Web
- Cloud Armor (WAF) na backendzie API
- Rate limiting Cloud Armor
- HTTP → HTTPS redirect (port 80)
- Cloud DNS (opcjonalnie) dla `www.papadata.pl`
- Identity Platform (Email + Google + Microsoft)
- Secret Manager (sekrety bez wersji — wersje dodaj osobno)
- Cloud SQL (instancja + baza + użytkownik)
- Cloud SQL Private IP (VPC + PSC + Serverless VPC Access)
- Cloud SQL Auth Proxy (Cloud Run annotation)
- Generowanie hasła do Cloud SQL + polityka rotacji w Secret Manager

## Pliki

- [versions.tf](versions.tf)
- [variables.tf](variables.tf)
- [main.tf](main.tf)
- [outputs.tf](outputs.tf)
- [terraform.tfvars.example](terraform.tfvars.example)
