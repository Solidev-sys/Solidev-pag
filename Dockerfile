# ============================================
# DOCKERFILE SEGURO - SOLIDEV BACKEND
# Hardened para producción
# ============================================

# Etapa de build
FROM node:20-slim AS builder
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive

# Copiar manifiestos e instalar TODAS las dependencias
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY controllers/ ./controllers/
COPY js/ ./js/

# Etapa de runtime (SEGURA)
FROM node:20-slim AS runtime
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV BIND=0.0.0.0
ENV HTTP_PORT=3002

# Crear usuario sin privilegios
RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs backend && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm

# Copiar todo desde builder
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/controllers ./controllers
COPY --from=builder --chown=backend:nodejs /app/js ./js
COPY --chown=backend:nodejs package*.json ./

# Permisos restrictivos
RUN chmod -R 550 /app

EXPOSE 3002

USER backend

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "const http = require('http'); http.get('http://localhost:3002/', (r) => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))" || exit 1

CMD ["node", "controllers/api.js"]
