output "repository_url" {
  description = "Full Artifact Registry repository URL for tagging images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker.repository_id}"
}
