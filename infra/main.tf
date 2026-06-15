# ============================================================
# IaC Terraform — Infraestrutura Segura NICE — Plataforma de Saúde Mental e Bem-Estar
# Sprint 4 — Controles de Segurança
# ============================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # CONTROLE 1 — Backend remoto com state criptografado
  backend "s3" {
    bucket         = "nice-terraform-state"
    key            = "prod/nice/terraform.tfstate"
    region         = "sa-east-1"
    encrypt        = true
    kms_key_id     = "arn:aws:kms:sa-east-1:123456789012:key/mrk-nice-tfstate"
    dynamodb_table = "nice-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "NICE-Plataforma"
      Environment = var.environment
      ManagedBy   = "Terraform"
      SecurityTier = "High"
    }
  }
}

# ============================================================
# CONTROLE 2 — VPC Isolada com subnets privadas
# ============================================================
resource "aws_vpc" "nice_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "nice-vpc-${var.environment}" }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.nice_vpc.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false  # Sem IPs públicos nas subnets privadas

  tags = { Name = "nice-private-${count.index}-${var.environment}" }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.nice_vpc.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false  # Nunca expor IPs públicos automaticamente

  tags = { Name = "nice-public-${count.index}-${var.environment}" }
}

# ============================================================
# CONTROLE 3 — Security Groups restritivos (least privilege)
# ============================================================
# ------------------------------------------------------------
# NOTA DE SEGURANÇA / CORREÇÃO (Sprint 4):
# Anteriormente as regras de ingress/egress estavam declaradas
# inline dentro de aws_security_group.app_sg e aws_security_group.alb_sg,
# e cada uma referenciava o security_group_id do outro
# (app_sg -> alb_sg.id e alb_sg -> app_sg.id).
# Isso gera uma dependência circular detectada pelo Terraform:
#   "Error: Cycle: aws_security_group.app_sg, aws_security_group.alb_sg"
# pois o Terraform não consegue determinar qual recurso criar primeiro.
#
# CORREÇÃO: os Security Groups passam a ser declarados "vazios"
# (sem blocos ingress/egress inline) e cada regra é definida como
# um recurso aws_security_group_rule independente. Isso quebra o
# ciclo, pois os dois SGs podem ser criados em paralelo e as regras
# (que referenciam ambos os IDs) são aplicadas somente depois,
# preservando o mesmo modelo de least-privilege.
# ------------------------------------------------------------
resource "aws_security_group" "app_sg" {
  name        = "nice-app-sg"
  description = "SG para o servico NICE — apenas trafego necessario"
  vpc_id      = aws_vpc.nice_vpc.id

  tags = { Name = "nice-app-sg" }
}

resource "aws_security_group" "alb_sg" {
  name        = "nice-alb-sg"
  description = "SG do ALB — apenas HTTPS publico"
  vpc_id      = aws_vpc.nice_vpc.id

  tags = { Name = "nice-alb-sg" }
}

# Ingress do app_sg: apenas trafego do ALB na porta 3000
resource "aws_security_group_rule" "app_sg_ingress_from_alb" {
  type                     = "ingress"
  description              = "HTTP da aplicacao via ALB interno"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.app_sg.id
  source_security_group_id = aws_security_group.alb_sg.id
}

# Egress do app_sg: HTTPS para servicos externos
resource "aws_security_group_rule" "app_sg_egress_https" {
  type              = "egress"
  description       = "HTTPS para servicos externos"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.app_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}

# Egress do app_sg: DNS
resource "aws_security_group_rule" "app_sg_egress_dns" {
  type              = "egress"
  description       = "DNS"
  from_port         = 53
  to_port           = 53
  protocol          = "udp"
  security_group_id = aws_security_group.app_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}

# Ingress do alb_sg: HTTPS publico
resource "aws_security_group_rule" "alb_sg_ingress_https" {
  type              = "ingress"
  description       = "HTTPS publico"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}

# Egress do alb_sg: encaminha apenas para app_sg na porta 3000 (forca HTTPS de entrada / bloqueia HTTP)
resource "aws_security_group_rule" "alb_sg_egress_to_app" {
  type                     = "egress"
  description              = "Encaminhamento para a aplicacao (forca HTTPS na borda)"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.alb_sg.id
  source_security_group_id = aws_security_group.app_sg.id
}

# ============================================================
# CONTROLE 4 — Criptografia em trânsito e em repouso (KMS)
# ============================================================
resource "aws_kms_key" "nice_key" {
  description             = "KMS key para criptografia de dados NICE"
  deletion_window_in_days = 30
  enable_key_rotation     = true  # Rotação automática anual

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM policies"
        Effect = "Allow"
        Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Deny direct use without role"
        Effect = "Deny"
        Principal = { AWS = "*" }
        Action   = ["kms:Decrypt", "kms:Encrypt"]
        Resource = "*"
        Condition = {
          StringNotEquals = {
            "aws:PrincipalArn" = [
              "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/nice-app-role"
            ]
          }
        }
      }
    ]
  })

  tags = { Name = "nice-master-key" }
}

resource "aws_kms_alias" "nice_key_alias" {
  name          = "alias/nice-master-key"
  target_key_id = aws_kms_key.nice_key.key_id
}

# ============================================================
# CONTROLE 5 — Secrets Manager para credenciais (sem hardcode)
# ============================================================
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "nice/${var.environment}/app-secrets"
  description             = "Credenciais do NICE — rotação automática habilitada"
  kms_key_id              = aws_kms_key.nice_key.id
  recovery_window_in_days = 14

  tags = { Name = "nice-app-secrets" }
}

resource "aws_secretsmanager_secret_rotation" "app_secrets_rotation" {
  secret_id           = aws_secretsmanager_secret.app_secrets.id
  rotation_lambda_arn = aws_lambda_function.secret_rotator.arn

  rotation_rules {
    automatically_after_days = 30  # Rotação a cada 30 dias
  }
}

# ============================================================
# CONTROLE 6 — IAM Role com least-privilege para a aplicação
# ============================================================
resource "aws_iam_role" "app_role" {
  name = "nice-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })

  tags = { Name = "nice-app-role" }
}

resource "aws_iam_role_policy" "app_policy" {
  name = "nice-app-policy"
  role = aws_iam_role.app_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ReadSecrets"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.app_secrets.arn
      },
      {
        Sid    = "UseKMSKey"
        Effect = "Allow"
        Action = ["kms:Decrypt", "kms:GenerateDataKey"]
        Resource = aws_kms_key.nice_key.arn
      },
      # Negar tudo mais — deny explícito
      {
        Sid    = "DenyAdmin"
        Effect = "Deny"
        Action = ["iam:*", "kms:DeleteKey", "ec2:*", "s3:DeleteBucket"]
        Resource = "*"
      }
    ]
  })
}

# ============================================================
# CONTROLE 7 — CloudTrail: auditoria de todas as chamadas API
# ============================================================
resource "aws_cloudtrail" "nice_trail" {
  name                          = "nice-audit-trail"
  s3_bucket_name                = aws_s3_bucket.trail_bucket.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true  # Detecta adulteração dos logs
  kms_key_id                    = aws_kms_key.nice_key.arn

  event_selector {
    read_write_type           = "All"
    include_management_events = true

    data_resource {
      type   = "AWS::S3::Object"
      values = ["arn:aws:s3:::nice-*/*"]
    }
  }

  tags = { Name = "nice-cloudtrail" }
}

resource "aws_s3_bucket" "trail_bucket" {
  bucket        = "nice-cloudtrail-logs-${data.aws_caller_identity.current.account_id}"
  force_destroy = false  # Impede exclusão acidental

  tags = { Name = "nice-cloudtrail-logs" }
}

resource "aws_s3_bucket_versioning" "trail_bucket_versioning" {
  bucket = aws_s3_bucket.trail_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "trail_bucket_encryption" {
  bucket = aws_s3_bucket.trail_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.nice_key.arn
    }
  }
}

resource "aws_s3_bucket_public_access_block" "trail_bucket_block" {
  bucket                  = aws_s3_bucket.trail_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================================
# CONTROLE 8 — AWS Config para conformidade contínua
# ============================================================
resource "aws_config_configuration_recorder" "nice" {
  name     = "nice-config-recorder"
  role_arn = aws_iam_role.config_role.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }
}

# CORREÇÃO: o tipo de recurso correto no provider hashicorp/aws é
# "aws_config_config_rule" (não "aws_config_rule"). O nome antigo
# não existe no schema do provider e causava o erro:
#   "Error: Invalid resource type ... does not support resource type
#    'aws_config_rule'."
resource "aws_config_config_rule" "no_public_s3" {
  name = "nice-no-public-s3-buckets"
  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_PUBLIC_READ_PROHIBITED"
  }
  depends_on = [aws_config_configuration_recorder.nice]
}

resource "aws_config_config_rule" "encrypted_volumes" {
  name = "nice-encrypted-ebs-volumes"
  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }
  depends_on = [aws_config_configuration_recorder.nice]
}

resource "aws_config_config_rule" "mfa_enabled" {
  name = "nice-mfa-enabled-for-iam-console"
  source {
    owner             = "AWS"
    source_identifier = "MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS"
  }
  depends_on = [aws_config_configuration_recorder.nice]
}

# ============================================================
# CONTROLE 9 — GuardDuty para detecção de ameaças
# ============================================================
resource "aws_guardduty_detector" "nice" {
  enable = true

  datasources {
    s3_logs {
      enable = true
    }
    kubernetes {
      audit_logs {
        enable = true
      }
    }
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes {
          enable = true
        }
      }
    }
  }

  tags = { Name = "nice-guardduty" }
}

# ============================================================
# CONTROLE 10 — WAF para proteção da API
# ============================================================
resource "aws_wafv2_web_acl" "nice_waf" {
  name  = "nice-waf"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "nice-common-rules"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "RateLimitRule"
    priority = 2
    action {
      block {}
    }
    statement {
      rate_based_statement {
        limit              = 2000  # Max 2000 req/5min por IP
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "nice-rate-limit"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "nice-waf"
    sampled_requests_enabled   = true
  }

  tags = { Name = "nice-waf" }
}

# ============================================================
# Variáveis
# ============================================================
variable "aws_region" {
  description = "Região AWS"
  default     = "sa-east-1"
}

variable "environment" {
  description = "Ambiente de execucao"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser dev, staging ou prod."
  }
}

# ============================================================
# Data Sources
# ============================================================
data "aws_availability_zones" "available" {
  state = "available"
}
data "aws_caller_identity" "current" {}

# Placeholder para o Lambda de rotação (referenciado acima)
resource "aws_lambda_function" "secret_rotator" {
  filename      = "secret_rotator.zip"
  function_name = "nice-secret-rotator"
  role          = aws_iam_role.app_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  tags          = { Name = "nice-secret-rotator" }

  # CORREÇÃO (Semgrep: aws-lambda-x-ray-tracing-not-active):
  # Habilita o X-Ray em modo ativo para rastreamento ponta-a-ponta
  # das execuções da função de rotação de segredos.
  tracing_config {
    mode = "Active"
  }
}

# Permite que a role da função envie traces para o X-Ray
resource "aws_iam_role_policy_attachment" "secret_rotator_xray" {
  role       = aws_iam_role.app_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

resource "aws_iam_role" "config_role" {
  name               = "nice-config-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Action = "sts:AssumeRole", Effect = "Allow",
      Principal = { Service = "config.amazonaws.com" } }]
  })
}

# ============================================================
# Outputs
# ============================================================
output "vpc_id" {
  value = aws_vpc.nice_vpc.id
}

output "kms_key_arn" {
  value = aws_kms_key.nice_key.arn
}

output "secret_arn" {
  value = aws_secretsmanager_secret.app_secrets.arn
}

output "guardduty_id" {
  value = aws_guardduty_detector.nice.id
}
