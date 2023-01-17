
resource "aws_cloudwatch_log_group" "ecs_cw_log_group" {
  name = "${local.service_config_name_env}-logs"
}

resource "aws_ssm_parameter" "password" {
  name      = "/ecs/faktory/${var.env}/FAKTORY_PASSWORD"
  type      = "SecureString"
  value     = data.doppler_secrets.app.map["FAKTORY_PASSWORD"]
  overwrite = true
  tags = {
    name = "FAKTORY_PASSWORD"
  }
}

# Create task definitions for app services
resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                   = local.ecs_task_definition_family
  execution_role_arn       = var.task_execution_role_arn
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 1024
  cpu                      = 512

  container_definitions = jsonencode([
    # app container
    {
      name      = "${local.ecs_task_definition_family}-app"
      image     = "contribsys/faktory"
      essential = true
      cpu       = 512
      memory    = 1024
      portMappings = [
        {
          containerPort = 7419
          hostPort      = 7419
          protocol      = "tcp"
        },
        {
          containerPort = 7420
          hostPort      = 7420
          protocol      = "tcp"
        }
      ]
      entryPoint = [
        "sh",
        "-c",
        "/faktory -b 0.0.0.0:7419 -w 0.0.0.0:7420 -e production"
      ]
      secrets = concat([
        {
          name      = aws_ssm_parameter.password.tags.name
          valueFrom = aws_ssm_parameter.password.arn
        }
        ], [
        {
          name      = "DD_API_KEY"
          valueFrom = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/terraform/prd/DATADOG_API_KEY"
        }
      ])
      logConfiguration = {
        logDriver = "awsfirelens"
        options = {
          Name        = "datadog"
          Host        = "http-intake.logs.datadoghq.com"
          TLS         = "on"
          dd_service  = "ecs"
          dd_source   = "aws"
          dd_tags     = "env:${var.env},app:faktory,host:${local.ecs_task_definition_family}-app"
          provider    = "ecs"
          retry_limit = "2"
        }
        secretOptions = [
          {
            name      = "apikey"
            valueFrom = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/terraform/prd/DATADOG_API_KEY"
          }
        ]
      }
      environment = []
      mountPoints = []
      volumesFrom = []
    },
    # datadog agent container
    {
      name              = "${local.ecs_task_definition_family}-datadog-agent"
      image             = "public.ecr.aws/datadog/agent:latest"
      essential         = true
      cpu               = 0
      memoryReservation = 128
      environment = [
        {
          name  = "DD_APM_ENABLED",
          value = "true"
        },
        {
          name  = "DD_DOGSTATSD_NON_LOCAL_TRAFFIC",
          value = "true"
        },
        {
          name  = "DD_APM_NON_LOCAL_TRAFFIC",
          value = "true"
        },
        {
          name  = "DD_PROCESS_AGENT_ENABLED",
          value = "true"
        },
        {
          name  = "DD_TAGS",
          value = "env:${var.env} app:faktory"
        },
        {
          name  = "DD_TRACE_ANALYTICS_ENABLED",
          value = "true"
        },
        {
          name  = "DD_RUNTIME_METRICS_ENABLED",
          value = "true"
        },
        {
          name  = "DD_PROFILING_ENABLED",
          value = "true"
        },
        {
          name  = "DD_LOGS_INJECTION",
          value = "true"
        },
        {
          name  = "DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_GRPC_ENDPOINT",
          value = "0.0.0.0:4317"
        },
        {
          name  = "DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_HTTP_ENDPOINT",
          value = "0.0.0.0:4318"
        },
        {
          name  = "ECS_FARGATE",
          value = "true"
        }
      ]
      secrets = [
        {
          name      = "DD_API_KEY"
          valueFrom = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/terraform/prd/DATADOG_API_KEY"
        }
      ]
      mountPoints = []
      portMappings = [
        {
          protocol      = "udp"
          hostPort      = 8125
          containerPort = 8125
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = resource.aws_cloudwatch_log_group.ecs_cw_log_group.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "core"
        }
      }
      volumesFrom = []
    },
    # log router container
    {
      name              = "${local.ecs_task_definition_family}-log-router"
      image             = "amazon/aws-for-fluent-bit:stable"
      essential         = true
      cpu               = 0
      memoryReservation = 100
      environment       = []
      mountPoints       = []
      portMappings      = []
      user              = "0"
      volumesFrom       = []
      firelensConfiguration = {
        type = "fluentbit"
        options = {
          enable-ecs-log-metadata = "true"
          config-file-type        = "file"
          config-file-value       = "/fluent-bit/configs/parse-json.conf"
        }
      }
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = resource.aws_cloudwatch_log_group.ecs_cw_log_group.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "core"
        }
      }
    }
  ])
  tags = {}
}

resource "aws_alb_listener" "alb_listener" {
  load_balancer_arn = var.alb_listener.alb_arn
  port              = var.alb_listener.port
  protocol          = var.alb_listener.protocol
  certificate_arn   = var.alb_listener.protocol == "HTTPS" ? var.alb_listener.certificate_arn : null

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "No routes defined"
      status_code  = "200"
    }
  }
}

resource "aws_alb_target_group" "alb_target_group" {
  name        = "${local.service_config_name_env}-tg"
  port        = var.alb_target_group.port
  protocol    = var.alb_target_group.protocol
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    healthy_threshold = 2
    interval          = 5
    timeout           = 4
    path              = var.alb_target_group.health_check_path
    protocol          = var.alb_target_group.protocol
  }
}

resource "aws_alb_listener_rule" "alb_listener_rule" {
  listener_arn = aws_alb_listener.alb_listener.arn
  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.alb_target_group.arn
  }
  condition {
    path_pattern {
      values = var.alb_target_group.path_pattern
    }
  }
}

#Create services for app services
resource "aws_ecs_service" "ecs_service" {
  name            = "${local.service_config_name_env}-service"
  cluster         = var.cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = var.subnets
    assign_public_ip = var.is_public
    security_groups  = [var.security_group_id]
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.alb_target_group.arn
    container_name   = "${local.ecs_task_definition_family}-app"
    container_port   = var.container_port
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "record" {
  name    = "faktory"
  type    = "CNAME"
  ttl     = 300
  zone_id = var.zone_id
  records = [var.alb_dns_name]
}

