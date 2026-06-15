# Dockerfile Seguro — NICE — Plataforma de Saúde Mental e Bem-Estar (React Native / Expo)
# Sprint 4 — Segurança em Containers e IaC
# ============================================================

# --- Estágio 1: Build ---
FROM node:20-alpine AS builder
RUN addgroup -S appgroup && adduser -S appuser -G appgroup


WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --omit=dev
COPY --chown=appuser:appgroup . .
RUN npm run build 2>/dev/null || echo "No build script — continuing"

# --- Estágio 2: Runtime (imagem mínima) ---
FROM node:20-alpine AS runtime

LABEL maintainer="NICE Security Team <security@nicemental.com.br>" \
      org.opencontainers.image.title="NICE Mental Health API" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.description="Plataforma digital de saúde mental e bem-estar — NICE" \
      org.opencontainers.image.source="https://github.com/vitordmoura/Nice-SprintCYB"

RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

RUN addgroup -S nice && adduser -S nice -G nice

WORKDIR /app

COPY --from=builder --chown=nice:nice /app/node_modules ./node_modules
COPY --from=builder --chown=nice:nice /app/src ./src
COPY --from=builder --chown=nice:nice /app/package.json ./
COPY --from=builder --chown=nice:nice /app/index.ts ./

RUN chmod -R 550 /app

USER nice

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1


ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/index.js"]
