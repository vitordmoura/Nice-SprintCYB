# NICE — Plataforma Digital de Saúde Mental e Bem‑Estar

> Aplicativo mobile desenvolvido com **React Native** e **Expo**, criado para apoiar o bem‑estar emocional, organização pessoal e hábitos saudáveis, com segurança integrada desde o código até a infraestrutura.

---

## Grupo

| Nome | RM |
|------|------|
| Diana Letícia de Souza Inocencio | 553562 |
| João Viktor Carvalho de Souza | 552613 |
| Lucas Reis Diniz | 552838 |
| Thiago Araújo Vieira | 553477 |
| Victor Augusto Pereira dos Santos | 553518 |
| Vitor de Moura Nascimento | 553806 |

**Orientador:** Prof. Oerton Fernandes  

---

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | React Native 0.81 + Expo 54 |
| Linguagem | TypeScript |
| Navegação | React Navigation (Stack + Bottom Tabs) |
| Persistência | AsyncStorage |
| HTTP | Axios |
| Ícones | HugeIcons React Native |
| Infraestrutura | AWS (ECS, KMS, Secrets Manager, GuardDuty, WAF) |
| IaC | Terraform ≥ 1.5 |
| Container | Docker (node:20-alpine, multi-stage) |

---

## Arquitetura

```
NICE-SPRINTCYB/
├── .github/
│   └── workflows/
│       ├── applicationscan-pipeline.yml -------Pipeline de segurança (4 gates bloqueantes)
│       └── terraform-validate.yml -------------Validação automática do IaC
│
├── infra/
│   └── main.tf --------------------------------Terraform — 10 controles de segurança AWS
│
├── Dockerfile ---------------------------------Container seguro (CIS Docker Benchmark)
├── .gitleaks.toml -----------------------------Regras customizadas de secret scan
│
├── assets/
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
└── src/
    ├── components/
    │   ├── CategoryIcon.tsx
    │   ├── CustomButton.tsx
    │   ├── CustomInput.tsx
    │   ├── EmptyState.tsx
    │   ├── FilterBar.tsx
    │   ├── Header.tsx
    │   ├── StatusBadge.tsx
    │   └── TaskCard.tsx
    │
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── TaskContext.tsx
    │   └── ThemeContext.tsx
    │
    ├── hooks/
    │   └── useTasks.ts
    │
    ├── routes/
    │   ├── AppRoutes.tsx
    │   ├── TabRoutes.tsx
    │   └── TaskStackRoutes.tsx
    │
    ├── screens/
    │   ├── home/HomeScreen.tsx
    │   ├── tasks/TaskListScreen.tsx
    │   ├── tasks/TaskDetailScreen.tsx
    │   ├── tasks/TaskFormScreen.tsx
    │   ├── settings/SettingsScreen.tsx
    │   └── LoginScreen.tsx
    │
    ├── services/
    │   ├── api.ts
    │   └── taskStorage.ts
    │
    ├── types/
    │   ├── task.ts
    │   ├── user.ts
    │   └── navigation.ts
    │
    └── utils/
        ├── formatDate.ts
        └── generateId.ts
```

---

## Funcionalidades

### Autenticação
- Login com contexto global
- Persistência de sessão via AsyncStorage
- Rotas protegidas

### Tarefas e Organização
- Listagem de tarefas com filtros por status e categoria
- Criação, edição e exclusão
- Status: **Pendente**, **Em Andamento**, **Concluída**
- Prioridade: **Baixa**, **Média**, **Alta**
- Categorias: Trabalho, Estudos, Saúde, Pessoal, Finanças, Lazer, Compras, Outros

### Home
- Frase motivacional via API
- Resumo das tarefas do dia

### Configurações
- Tema claro/escuro
- Preferências do usuário

---

## Demonstração

https://github.com/user-attachments/assets/cfc255d8-57d1-4c3c-8643-c5b4805e3fd5

---

## Instalação

### Pré‑requisitos
- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npx expo start
```

Escaneie o QR Code com o aplicativo **Expo Go** (Android/iOS) ou pressione:
- `a` — abrir no emulador Android
- `i` — abrir no simulador iOS
- `w` — abrir no navegador (web)

---

---

# 🔐 Cybersecurity — Sprint 3

## Segurança no CI/CD e Ferramentas Automatizadas

Estruturação e automação de pipeline configurado no **GitHub Actions**, responsável por executar automaticamente verificações de segurança sempre que há um `push` ou `pull request`.

### Ferramentas integradas (Sprint 3)

| Ferramenta | Tipo | Função |
|------------|------|--------|
| Semgrep | SAST | Análise estática — identifica padrões inseguros no código-fonte |
| npm audit | SCA | Analisa dependências externas com CVEs conhecidos |
| GitLeaks | Secret Scan | Detecta credenciais e tokens acidentalmente versionados |

### Resultados (Sprint 3)

| Ferramenta | Resultado | Evidência |
|------------|-----------|-----------|
| Semgrep | ✅ 0 findings — 243 regras, 42 arquivos | `semgrep-report.txt` |
| npm audit | ⚠️ 4 moderate (postcss via Expo — sem fix sem breaking change) | `audit-report.txt` |
| GitLeaks | ✅ 0 leaks — artefato SARIF gerado | `gitleaks-results.sarif` |

### Gestão de Segredos (Sprint 3)
- `.gitignore` configurado — `.env` e arquivos sensíveis nunca versionados
- Variáveis protegidas via **GitHub Secrets** (`${{ secrets.GITHUB_TOKEN }}`)
- Princípio do acesso mínimo aplicado nos tokens do pipeline
- Rotação periódica revisada manualmente no GitHub Secrets

### Análise de Ameaças — OWASP Risk Rating

| Risco | Probabilidade | Impacto | Severidade |
|-------|--------------|---------|------------|
| Exposição de Segredos | Alta | Alta | **Crítica** |
| Dependências Vulneráveis | Alta | Média | **Alta** |
| Configuração Inadequada do Pipeline | Baixa | Alta | **Alta** |
| Ambiente Local Inseguro | Média | Alta | **Alta** |
| APIs Externas Inseguras | Média | Média | **Média** |
| Falhas Estruturais no Código | Média | Média | **Média** |

---

---

# 🛡️ Cybersecurity — Sprint 4

## Segurança em Containers, IaC, Monitoramento e Resposta a Incidentes

Nesta sprint, evoluimos os controles da Sprint 3 com foco em quatro frentes: container seguro, infraestrutura como código, monitoramento contínuo e resposta a incidentes. Todas as correções documentadas abaixo foram motivadas por vulnerabilidades reais identificadas na Sprint 3.

---

## 4. Segurança em Containers e Infraestrutura como Código

### 4.1 Dockerfile Seguro

O `Dockerfile` segue o **CIS Docker Benchmark v1.6** com multi-stage build, imagem Alpine mínima e usuário não-root:

```dockerfile
# Estágio 1 — Build (ferramentas de dev não vão para produção)
FROM node:20-alpine AS builder
RUN npm ci --ignore-scripts --omit=dev

# Estágio 2 — Runtime mínimo
FROM node:20-alpine AS runtime
RUN apk update && apk upgrade --no-cache   # Patch CVEs da imagem base
RUN addgroup -S nice && adduser -S nice -G nice
USER nice                                   # Nunca root em produção
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget --spider http://localhost:3000/health || exit 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]    # PID 1 correto — sem zombie processes
```

| Prática | Referência CIS | O que protege |
|---------|---------------|---------------|
| Multi-stage build | DI-4.1 | Elimina ferramentas de build da imagem final |
| `node:20-alpine` com tag explícita | DI-4.2 | Builds reproduzíveis, sem CVEs surpresa |
| Usuário não-root (`nice`) | DI-4.1 | Limita impacto de RCE via dependência vulnerável |
| `npm ci --ignore-scripts` | DI-4.7 | Bloqueia lifecycle scripts maliciosos (supply chain) |
| `apk upgrade` no runtime | DI-4.3 | Mitiga CVE-2024-5535 (libssl3, CVSS 5.9) |
| `chmod -R 550 /app` | DI-4.6 | Processo não pode modificar seus próprios arquivos |
| `dumb-init` | DI-4.8 | SIGTERM propagado corretamente — shutdown gracioso |
| Sem `ENV` com secrets | DI-4.5 | `docker inspect` não expõe credenciais |

**Execução recomendada em produção:**
```bash
docker run --read-only --tmpfs /tmp --tmpfs /run nice/mental:1.0.0
```

---

### 4.2 Análise de Vulnerabilidades — Trivy

```bash
trivy image --exit-code 1 --severity HIGH,CRITICAL \
            --vuln-type os --format sarif \
            nice/mental:$(git rev-parse --short HEAD)
```

> `--exit-code 1` → pipeline **falha** se encontrar HIGH ou CRITICAL. Isso é o que diferencia monitoramento de proteção real.

**Resultado do scan — `nice/mental:1.0.0` (Alpine 3.19.1):**

| CVE | Biblioteca | CVSS | Severidade | Decisão |
|-----|-----------|------|------------|---------|
| CVE-2024-5535 | libssl3 | 5.9 | MEDIUM | **Mitigado** — `apk upgrade` aplica fix 3.1.6-r0 no build |
| CVE-2024-4741 | libcrypto3 | 5.9 | LOW | **Aceito** — use-after-free local, sem impacto em container isolado |
| CVE-2023-42364 | busybox | 3.3 | LOW | **Aceito** — awk não usado em runtime, CVSS mínimo |

```
CRITICAL : 0  ✅
HIGH     : 0  ✅
MEDIUM   : 1  ⚠️  (mitigado via apk upgrade)
LOW      : 2  ℹ️  (aceitos com justificativa técnica)
Secrets  : 0  ✅
```

**Imagem aprovada para staging.**

---

### 4.3 Infraestrutura como Código — Terraform

Arquivo: `infra/main.tf` | Região: `sa-east-1` (São Paulo — obrigatório por LGPD)

| # | Controle | Recurso Terraform | Justificativa |
|---|----------|-------------------|---------------|
| 1 | Backend S3 criptografado | `backend "s3"` com `encrypt=true` + KMS | State expõe topologia completa da infra se vazar |
| 2 | VPC isolada — subnets privadas | `aws_vpc` + `aws_subnet` com `map_public_ip_on_launch=false` | App nunca exposta diretamente à internet |
| 3 | Security Groups restritivos | `aws_security_group_rule` separados (sem ciclo de dependência) | Ingress apenas do ALB:3000, egress apenas HTTPS+DNS |
| 4 | KMS com rotação anual | `aws_kms_key` com `enable_key_rotation=true` | Dados clínicos em repouso criptografados e rotacionados |
| 5 | Secrets Manager + rotação 30d | `aws_secretsmanager_secret_rotation` via Lambda | Zero credenciais hardcodadas — rotação automática |
| 6 | IAM least-privilege | `aws_iam_role_policy` com `DenyAdmin` explícito | Credencial comprometida não causa dano catastrófico |
| 7 | CloudTrail multi-region | `aws_cloudtrail` com `enable_log_file_validation=true` | Auditoria exigida pela LGPD Art. 37 |
| 8 | AWS Config — conformidade | `aws_config_config_rule` (S3 público, EBS criptografado, MFA) | Alerta imediato se infraestrutura derivar do estado seguro |
| 9 | GuardDuty ativo | `aws_guardduty_detector` com S3, K8s e malware scan | Detecção de acesso anômalo a dados de saúde mental |
| 10 | WAF + rate limiting | `aws_wafv2_web_acl` — regras OWASP + 2.000 req/5min/IP | Protege API contra scraping de dados psicossociais |

**Validação automática do IaC:**
```bash
# Pipeline terraform-validate.yml executa a cada push em infra/**
terraform fmt -check   # Verifica formatação
terraform init -backend=false
terraform validate     # Valida sintaxe, tipos e referências
```

---

### 4.4 Pipeline com 4 Gates Bloqueantes

**Correção direta da Sprint 3:** o `|| true` foi removido do `npm audit`. Agora cada gate interrompe o pipeline se encontrar vulnerabilidade acima do threshold.

```
Push / PR
    │
    ├─ GATE 1 ── Semgrep (SAST) ──────── qualquer finding → BLOQUEIA
    ├─ GATE 2 ── npm audit (SCA) ──────── HIGH/CRITICAL → BLOQUEIA
    ├─ GATE 3 ── GitLeaks (Secrets) ───── qualquer secret → BLOQUEIA
    └─ GATE 4 ── Trivy (Container) ─────── HIGH/CRITICAL → BLOQUEIA
                    │
                    ▼
              Deploy autorizado
```

| Gate | Sprint 3 | Sprint 4 |
|------|----------|----------|
| Semgrep | ✅ Bloqueante | ✅ Mantido |
| npm audit | ❌ `\|\| true` — não bloqueava | ✅ Corrigido — HIGH/CRITICAL bloqueiam |
| GitLeaks | ✅ Bloqueante | ✅ + regra customizada `.gitleaks.toml` |
| Trivy | ❌ Não existia | ✅ Novo — scan de container com `--exit-code 1` |

---

### 4.5 Regras Customizadas — `.gitleaks.toml`

Criamos regras específicas para detectar padrões que o scanner padrão não cobre:

```toml
# Detecta: password: '123', senha: 'abc', pwd: 'test'
[[rules]]
id = "nice-hardcoded-weak-password"
regex = '''(?i)(password|senha|pwd)\s*[:=]\s*['"][^'"]{1,12}['"]'''

# Detecta: username: 'admin', password: '123' no mesmo bloco
[[rules]]
id = "nice-hardcoded-user-credentials"
regex = '''username\s*[:=]\s*['"][^'"]+['"],\s*password\s*[:=]\s*['"][^'"]+['"]'''
```

---

## 5. Monitoramento, Auditoria e Resposta Contínua

### Por que monitoramento é obrigatório no NICE

O NICE processa dados de saúde mental — categoria **especialmente sensível pela LGPD (Art. 11)**. O Art. 48 obriga notificação à ANPD e aos titulares em até **72 horas** em caso de incidente. Um vazamento de registros emocionais ou escalas clínicas é um incidente de alto impacto ético, jurídico e reputacional.

### Eventos Monitorados

| Evento | Fonte | Threshold | Severidade | Obrigação LGPD |
|--------|-------|-----------|------------|----------------|
| Falhas de autenticação consecutivas | CloudWatch / App | > 5 em 5min | 🔴 CRÍTICO | Art. 46 |
| Acesso a registros emocionais fora do horário | CloudTrail / RDS | Qualquer acesso 22h–6h | 🔴 CRÍTICO | Art. 37 |
| Acesso de IP/país não reconhecido | GuardDuty | Qualquer | 🟠 ALTO | Art. 48 |
| Exportação em massa (> 100 registros) | CloudTrail | 1 ocorrência | 🔴 CRÍTICO | Art. 48 — notificação obrigatória |
| Escalada de privilégios IAM | CloudTrail | Qualquer attach Admin | 🔴 CRÍTICO | Art. 46 |
| Bucket S3 tornado público | AWS Config | 1 ocorrência | 🔴 CRÍTICO | Art. 48 — notif. 72h |
| Rate limit excedido na API | WAF / CloudWatch | > 2.000 req/5min/IP | 🟡 MÉDIO | Art. 46 |
| Secret acessado por processo não autorizado | CloudTrail | PrincipalArn fora da role | 🔴 CRÍTICO | Art. 48 |

### Fluxo de Resposta — NIST SP 800-61

```
Detecção (0–15min)          Contenção (15–60min)
GuardDuty / CloudWatch  →   Isolar container (ECS desired=0)
PagerDuty on-call       →   Revogar credencial comprometida
Ticket com timestamp    →   Snapshot EBS (preservação forense)
Classificação LGPD      →   Acionar DPO se dados sensíveis afetados
        │
        ▼
Erradicação                 Pós-Incidente (≤ 72h)
Rebuild imagem (Dockerfile) →   Post-mortem documentado
Rotacionar todos os secrets →   Notificação ANPD se Art. 48
Redeploy via CI/CD (4 gates) →  Comunicação aos titulares afetados
terraform plan (drift check) →  Atualizar runbook + métricas MTTD/MTTR
```

---

## 6. Incidente Simulado — Credencial Hardcodada Explorada

### Cenário

Baseado em vulnerabilidade real identificada no projeto: credenciais `admin/123` hardcodadas em `AuthContext.tsx` — arquivo público no repositório — exploradas por atacante para acessar registros de diário emocional de usuários do NICE.

### Linha do Tempo

| Timestamp | Evento |
|-----------|--------|
| Dia 1 — 09:12 | Commit com `password: '123'` hardcodado. Gitleaks padrão não detecta (não é API key). |
| Dia 1 — 09:14 | Pipeline passa. Código mergeado na `main`. Repositório público. |
| Dia 3 — 14:45 | Crawler indexa repo. Atacante testa `admin/123` na API. Login bem-sucedido. |
| Dia 3 — 15:00 | Com token admin: GET `/api/users` (847 registros) + GET `/api/users/*/diary` (50 registros de diário emocional). |
| Dia 3 — 15:22 | GuardDuty dispara: 50 requisições a `/diary` em 22min por IP externo (Rússia). |
| Dia 3 — 15:35 | Analista confirma incidente CRÍTICO. Contenção iniciada. |
| Dia 3 — 15:42 | Token revogado. Endpoint bloqueado via WAF. Logs preservados. |
| Dia 3 — 16:00 | LGPD Art. 48 acionado — 50 registros de saúde mental acessados. DPO notificado. |
| Dia 5 | Correção aplicada. Post-mortem concluído. ANPD notificada. |

### Causa Raiz

1. **Causa imediata:** credenciais literais em código-fonte público
2. **Causa contribuinte:** Gitleaks padrão não detecta `password: '123'` (não é padrão de API key)
3. **Causa raiz:** autenticação implementada no frontend — arquitetura incorreta. Ausência de code review com foco em segurança

### Ações Corretivas

| # | Ação | Prazo |
|---|------|-------|
| C1 | Mover autenticação para backend com `bcrypt` (custo mínimo 12) | 48h |
| C2 | Substituir `USERS` hardcodado por Secrets Manager | 48h |
| C3 | Rate limiting no login: máx 5 tentativas / IP / 15min | 24h |
| C4 | Alerta de exportação em massa: > 50 registros / IP / 30min | 24h |
| C5 | Regra customizada `.gitleaks.toml` para detectar `password: '123'` | ✅ Implementado |
| P1 | Notificação ANPD — Art. 48 LGPD (multa até R$50M por descumprimento) | 72h |
| P2 | Comunicar titulares afetados — Art. 48, §1º | 72h |

---

## Evidências de Execução (Sprint 4)

| Ferramenta | Resultado | Arquivo |
|------------|-----------|---------|
| Trivy | ✅ 0 CRITICAL/HIGH | `trivy-results.sarif` |
| Semgrep | ✅ 0 findings | `semgrep-report.txt` |
| npm audit | ⚠️ 4 moderate (postcss — sem HIGH/CRITICAL) | `audit-report.txt` |
| GitLeaks | ✅ 0 leaks | `gitleaks-results.sarif` |
| Terraform validate | ✅ Validado | `terraform-validate` workflow |

Todos os artefatos disponíveis em **Actions → Security Pipeline → Relatórios de execução**.

---
