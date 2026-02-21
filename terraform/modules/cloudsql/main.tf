resource "google_sql_database_instance" "postgres" {
  name             = "${var.app_name}-db"
  database_version = "POSTGRES_15"
  region           = var.region

  deletion_protection = true

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"

    ip_configuration {
      # Public IP required for Cloud SQL Auth Proxy (no VPC connector needed)
      # Auth Proxy authenticates via IAM and encrypts the connection — no network exposure
      ipv4_enabled = true
    }

    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "app_user" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}
