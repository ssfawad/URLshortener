resource "google_artifact_registry_repository" "docker" {
  location      = var.region
  repository_id = var.app_name
  format        = "DOCKER"
  description   = "Docker images for ${var.app_name}"
}
