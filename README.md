# URL Shortener

A production-realistic URL shortener built on GCP, demonstrating containerization, Infrastructure as Code, and CI/CD best practices.

## Architecture

```
User → Global HTTP(S) Load Balancer
          ├── /*     → Cloud CDN → Cloud Storage (React SPA)
          ├── /api/* → Serverless NEG → Cloud Run (Node.js API)
          └── /r/*   → Serverless NEG → Cloud Run (301 redirects)
                                              └── VPC Connector
                                                      └── Cloud SQL PostgreSQL (private IP)
                                                              └── Secret Manager (credentials)

GitHub Actions CI/CD:
  PR   → lint + docker build check
  main → build image → Artifact Registry → Cloud Run deploy
       → npm build  → GCS upload        → CDN invalidate
```

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React + Vite + Tailwind CSS         |
| Backend     | Node.js + Express                   |
| Database    | Cloud SQL (PostgreSQL 15)           |
| Compute     | Cloud Run (serverless containers)   |
| CDN/LB      | Global HTTP(S) Load Balancer + CDN  |
| Registry    | Artifact Registry                   |
| Secrets     | Secret Manager                      |
| Networking  | VPC + VPC Serverless Connector      |
| IaC         | Terraform                           |
| CI/CD       | GitHub Actions                      |

## Project Structure

```
.
├── .github/workflows/     # CI/CD pipelines
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── db/pool.js     # PostgreSQL connection pool
│   │   ├── routes/
│   │   │   ├── shorten.js # POST /api/shorten, GET /api/stats/:code
│   │   │   └── redirect.js# GET /r/:code → 301 redirect
│   │   └── index.js       # Express app entrypoint
│   └── Dockerfile
├── frontend/              # React SPA
│   └── src/components/
└── terraform/             # GCP infrastructure as code
    └── modules/
        ├── networking/    # VPC, subnets, VPC connector, Cloud NAT
        ├── artifact-registry/
        ├── secret-manager/
        ├── cloudsql/      # PostgreSQL (private IP only)
        ├── cloudrun/      # Cloud Run service + IAM
        └── load-balancer/ # Global LB, CDN, URL map
```

## Prerequisites

- GCP project with billing enabled
- GCS bucket for Terraform remote state
- `gcloud` CLI authenticated
- `terraform` >= 1.6
- `docker`
- Node.js >= 20

## Getting Started

### 1. Infrastructure (Terraform)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

### 2. Backend — Local Development

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local DB credentials
npm run dev
```

### 3. Frontend — Local Development

```bash
cd frontend
npm install
npm run dev
# Proxies /api and /r to http://localhost:8080
```

## API Reference

| Method | Path               | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/api/shorten`     | Create short URL               |
| GET    | `/api/stats/:code` | Get click count and metadata   |
| GET    | `/r/:code`         | Redirect to original URL (301) |
| GET    | `/healthz`         | Health check                   |

### POST /api/shorten

```json
// Request
{ "url": "https://example.com/very/long/path" }

// Response 201
{ "code": "abc1234", "originalUrl": "https://example.com/very/long/path" }
```

## GitHub Actions Secrets

| Secret              | Description                             |
|---------------------|-----------------------------------------|
| `GCP_PROJECT_ID`    | GCP project ID                          |
| `GCP_REGION`        | GCP region (e.g., `us-central1`)        |
| `GCP_SA_KEY`        | Service account JSON key (base64)       |
| `AR_REPO`           | Artifact Registry repo URL              |
| `CLOUD_RUN_SERVICE` | Cloud Run service name                  |
| `FRONTEND_BUCKET`   | GCS bucket name for frontend            |
| `LB_URL_MAP`        | URL map name for CDN cache invalidation |
