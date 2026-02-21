output "cloud_run_url" {
  description = "Cloud Run service URL — set as CLOUD_RUN_URL in GitHub Actions secrets"
  value       = module.cloudrun.service_url
}

output "cloud_run_service_name" {
  description = "Cloud Run service name — set as CLOUD_RUN_SERVICE in GitHub Actions secrets"
  value       = module.cloudrun.service_name
}

output "frontend_bucket" {
  description = "GCS bucket name — set as FRONTEND_BUCKET in GitHub Actions secrets"
  value       = module.storage.bucket_name
}

output "frontend_url" {
  description = "Public URL for the frontend"
  value       = module.storage.bucket_url
}

output "artifact_registry_repo" {
  description = "Artifact Registry repo URL — set as AR_REPO in GitHub Actions secrets"
  value       = module.artifact_registry.repository_url
}
