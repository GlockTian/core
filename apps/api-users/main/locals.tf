locals {
  identifier    = "api-users"
  env           = "main"
  port          = 4002
  cpu           = 1024
  memory        = 512
  desired_count = 1
  public_url    = "${local.identifier}.central.jesusfilm.org"
  private_url   = "${local.identifier}-${local.env}"
  env_secrets = {
    DATABASE_DB = var.database_db
    DATABASE_PASS = var.database_pass
    DATABASE_URL = var.database_url
    DATABASE_USER = var.database_user
    GOOGLE_APPLICATION_JSON = var.google_application_json
   }

  tags = {
    Name         = local.name
    env          = local.env
    project_name = local.identifier
    application  = local.identifier
    owner        = "apps@cru.org"
    managed_by   = "terraform"
    terraform    = replace(abspath(path.root), "/^.*/(core|default)/", "")
  }
}
