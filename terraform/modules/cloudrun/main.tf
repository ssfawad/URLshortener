# Dedicated service account for Cloud Run — least-privilege IAM
resource "google_service_account" "api" {
  account_id   = "${var.app_name}-api"
  display_name = "${var.app_name} Cloud Run Service Account"
}

resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.api.email}"
}

resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.api.email}"
}

resource "google_cloud_run_v2_service" "api" {
  name     = "${var.app_name}-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.api.email

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    # Cloud SQL Auth Proxy — mounts the Unix socket into the container
    # No VPC connector or Cloud NAT needed; auth is handled via IAM
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [var.cloudsql_connection_name]
      }
    }

    containers {
      image = var.image

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      # pg connects via Unix socket when DB_HOST starts with "/"
      # Socket path: /cloudsql/<project>:<region>:<instance>/.s.PGSQL.5432
      env {
        name  = "DB_HOST"
        value = "/cloudsql/${var.cloudsql_connection_name}"
      }

      env {
        name  = "DB_NAME"
        value = var.db_name
      }

      env {
        name  = "DB_USER"
        value = var.db_user
      }

      env {
        name  = "DB_PORT"
        value = "5432"
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      # DB password injected from Secret Manager at runtime — never in image or env files
      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = var.db_password_secret_id
            version = "latest"
          }
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      liveness_probe {
        http_get {
          path = "/healthz"
        }
        period_seconds    = 30
        failure_threshold = 3
      }

      startup_probe {
        http_get {
          path = "/healthz"
        }
        initial_delay_seconds = 10
        period_seconds        = 5
        failure_threshold     = 5
      }
    }
  }

  depends_on = [
    google_project_iam_member.secret_accessor,
    google_project_iam_member.cloudsql_client,
  ]
}

# Allow unauthenticated public access (public API + redirects)
resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
