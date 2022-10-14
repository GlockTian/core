resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "!$%&*?"
}

resource "aws_rds_cluster" "default" {
  cluster_identifier      = "${var.service_config.name}-${var.env}"
  engine                  = "aurora-postgresql"
  engine_version          = "13.7"
  availability_zones      = data.aws_availability_zones.current.names.*
  db_subnet_group_name    = var.env
  database_name           = var.env
  master_username         = "root"
  master_password         = random_password.password.result
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
}

resource "aws_ssm_parameter" "rds_password" {
  name      = "/rds/${var.service_config.name}/${var.env}/PG_PASSWORD"
  type      = "SecureString"
  value     = random_password.password.result
  overwrite = true
}

resource "aws_ssm_parameter" "rds_username" {
  name      = "/rds/${var.service_config.name}/${var.env}/PG_USERNAME"
  type      = "SecureString"
  value     = aws_rds_cluster.default.master_username
  overwrite = true
}

resource "aws_ssm_parameter" "rds_host" {
  name      = "/rds/${var.service_config.name}/${var.env}/PG_HOST"
  type      = "SecureString"
  value     = aws_rds_cluster.default.endpoint
  overwrite = true
}

resource "aws_ssm_parameter" "rds_port" {
  name      = "/rds/${var.service_config.name}/${var.env}/PG_PORT"
  type      = "SecureString"
  value     = aws_rds_cluster.default.port
  overwrite = true
}
