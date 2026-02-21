terraform {
  required_version = ">= 1.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── Enable required GCP APIs ────────────────────────────────────────────────

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# ── DB password — generated once, stored in Secret Manager ─────────────────

resource "random_password" "db_password" {
  length  = 32
  special = false
}

# ── Modules ─────────────────────────────────────────────────────────────────

module "artifact_registry" {
  source     = "./modules/artifact-registry"
  project_id = var.project_id
  region     = var.region
  app_name   = var.app_name
  depends_on = [google_project_service.apis]
}

module "secret_manager" {
  source      = "./modules/secret-manager"
  project_id  = var.project_id
  app_name    = var.app_name
  db_password = random_password.db_password.result
  depends_on  = [google_project_service.apis]
}

module "cloudsql" {
  source      = "./modules/cloudsql"
  project_id  = var.project_id
  region      = var.region
  app_name    = var.app_name
  db_name     = var.db_name
  db_user     = var.db_user
  db_password = random_password.db_password.result
  depends_on  = [google_project_service.apis]
}

module "cloudrun" {
  source                   = "./modules/cloudrun"
  project_id               = var.project_id
  region                   = var.region
  app_name                 = var.app_name
  image                    = "${module.artifact_registry.repository_url}/backend:latest"
  cloudsql_connection_name = module.cloudsql.instance_connection_name
  db_name                  = var.db_name
  db_user                  = var.db_user
  db_password_secret_id    = module.secret_manager.db_password_secret_id
  depends_on               = [module.cloudsql, module.artifact_registry, module.secret_manager]
}

module "storage" {
  source     = "./modules/storage"
  project_id = var.project_id
  app_name   = var.app_name
  region     = var.region
}
