locals {
  port = 4001
  environment_variables = [
    "DATABASE_DB",
    "DATABASE_PASS",
    "DATABASE_URL",
    "DATABASE_USER",
    "FIREBASE_API_KEY",
    "POWER_BI_CLIENT_ID",
    "POWER_BI_CLIENT_SECRET",
    "POWER_BI_JOURNEYS_MULTIPLE_FULL_REPORT_ID",
    "POWER_BI_JOURNEYS_MULTIPLE_SUMMARY_REPORT_ID",
    "POWER_BI_JOURNEYS_SINGLE_FULL_REPORT_ID",
    "POWER_BI_JOURNEYS_SINGLE_SUMMARY_REPORT_ID",
    "POWER_BI_TENANT_ID",
    "POWER_BI_WORKSPACE_ID"
  ]
  service_config = {
    name           = "api-journeys"
    is_public      = false
    container_port = local.port
    host_port      = local.port
    cpu            = 512
    memory         = 1024
    desired_count  = 1
    image_tag      = var.ecs_config.image_tag
    alb_dns_name   = var.ecs_config.alb_dns_name
    zone_id        = var.ecs_config.zone_id
    alb_target_group = merge(var.ecs_config.alb_target_group, {
      port = local.port
    })
    auto_scaling = {
      max_capacity = 2
      min_capacity = 1
      cpu = {
        target_value = 75
      }
      memory = {
        target_value = 75
      }
    }
  }
}
